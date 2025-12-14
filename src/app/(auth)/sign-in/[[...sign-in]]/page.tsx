import { SignIn } from "@clerk/nextjs";
import { Background } from "@/components/ui/Background";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Background />
      <SignIn />
    </div>
  );
}