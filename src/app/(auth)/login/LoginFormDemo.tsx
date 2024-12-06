"use client";

import { useTransition } from "react";
import { login } from "./actions";
import LoadingButton from "@/components/LoadingButton";

export default function AutoLoginButton() {
  const [isPending, startTransition] = useTransition();

  const handleAutoLogin = () => {
    startTransition(async () => {
      const result = await login({
        username: "DemoUser",
        password: "password123",
      });

      if (result.error) {
        console.error("Login failed:", result.error);
        alert("Login failed: " + result.error);
      } else {
        console.log("Login successful");
        alert("Login successful!");
      }
    });
  };

  return (
    <div className="mt-4 flex justify-center">
      <LoadingButton
        loading={isPending}
        onClick={handleAutoLogin}
        className="w-full bg-red-600 font-semibold text-white hover:bg-red-700"
      >
        Login as demo user
      </LoadingButton>
    </div>
  );
}
