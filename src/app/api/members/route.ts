import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMembers, getMemberByClerkId, updateMemberRole } from "@/lib/db/members";
import { z } from "zod";

const UpdateRoleSchema = z.object({
  memberId: z.string().min(1),
  role: z.enum(["ADMIN", "LIBRARIAN", "MEMBER"]),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentMember = await getMemberByClerkId(userId);
    if (!currentMember || currentMember.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const result = await getMembers({ page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[MEMBERS GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentMember = await getMemberByClerkId(userId);
    if (!currentMember || currentMember.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { memberId, role } = UpdateRoleSchema.parse(body);
    const updated = await updateMemberRole(memberId, role);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[MEMBERS PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
