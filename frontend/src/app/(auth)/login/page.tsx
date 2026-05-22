import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your trips and bookings."
      footer={
        <>
          New to LG Travels?{" "}
          <Link href="/register" className="font-semibold text-navy-700 hover:text-gold-600">
            Create an account
          </Link>
        </>
      }
    >
      <SignIn
        routing="hash"
        signUpUrl="/register"
        // Strip Clerk's own card chrome so it sits cleanly inside AuthShell.
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none border-none",
            card: "w-full shadow-none border-none bg-transparent p-0",
            header: "hidden",
            footer: "hidden",
            formButtonPrimary:
              "bg-navy-700 hover:bg-navy-800 text-white normal-case text-sm font-semibold",
          },
        }}
      />
    </AuthShell>
  );
}
