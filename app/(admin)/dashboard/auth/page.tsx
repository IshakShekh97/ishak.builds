import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/dashboard/login-form";
import { auth } from "@/lib/auth";

export default async function AuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/dashboard");

  return (
    <div className="w-full flex items-center justify-center p-4 min-h-[80vh]">
      <LoginForm />
    </div>
  );
}
