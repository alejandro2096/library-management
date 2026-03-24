import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">LibraryOS</h1>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>
        <SignUp />
      </div>
    </main>
  );
}
