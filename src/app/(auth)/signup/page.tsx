/*server-site compoment pro signup, to je duvod proc mumzeme nastavit metadata, v 
next.js je dobre pouzit co nejvice server-side rendering (optimalizace) 
ale na serveru nemuzeme spusit JS logiku( interaktivitu ) kdyz user interaguje se strankou 
(napr. buttonHandlers) proto potrebujeme client component SignUpForm.tsx*/

import { Metadata } from "next";
import signupImage from "@/assets/sign-up3.jpg";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm"; //client component

export const metadata: Metadata = {
  title: "Sign up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="rouded-2xl flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to Aware</h1>
            <p className="text-muted-foreground">
              Tell others what <span className="italic">you truly</span>
              <span> see and think </span>
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />

            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
