import { Metadata } from "next";
import LoginForm from "./LoginForm";
import LoginFormDemo from "./LoginFormDemo";
import Link from "next/link";
import loginImage from "@/assets/login.jpg";
import Image from "next/image";
import GoogleSignInButton from "./google/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="rouded-2xl flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">Login to Aware</h1>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <LoginFormDemo />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
