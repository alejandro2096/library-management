import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center gap-6 w-[28rem]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">LibraryOS</h1>
          <p className="mt-2 text-gray-600">Library Management System</p>
        </div>
        <SignIn appearance={{ elements: { cardBox: "w-[28rem]" } }} />
      </div>
    </main>
  );
}
