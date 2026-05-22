import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Create your account" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join 40,000+ travellers and start planning your next escape."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-navy-700 hover:text-gold-600">
            Sign in
          </Link>
        </>
      }
    >
      <SignUp
        routing="hash"
        signInUrl="/login"
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none border-none",
            card: "w-full shadow-none border-none bg-transparent p-0",
            header: "hidden",
            footer: "hidden",
            formButtonPrimary:
              "bg-gold-500 hover:bg-gold-600 text-navy-900 normal-case text-sm font-semibold",
          },
        }}
      />
    </AuthShell>
  );
}
