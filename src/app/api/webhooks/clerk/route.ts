import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { upsertMember, deleteMember } from "@/lib/db/members";
import { getMemberByClerkId } from "@/lib/db/members";

type ClerkUserEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    first_name: string | null;
    last_name: string | null;
  };
};

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: ClerkUserEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const { type, data } = event;

  try {
    if (type === "user.created" || type === "user.updated") {
      const email = data.email_addresses[0]?.email_address ?? "";
      const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || email;

      await upsertMember({
        clerkId: data.id,
        email,
        name,
      });
    }

    if (type === "user.deleted") {
      const member = await getMemberByClerkId(data.id);
      if (member) {
        await deleteMember(member.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WEBHOOK]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
