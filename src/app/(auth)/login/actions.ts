"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = loginSchema.parse(credentials);

    //musime zkontrolovat jestli je username a password existuje v databazi a jestli pouzili password pro prihlaseni, muze se stat ze username exist ale pouzili pro prihlaseni google ucet

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive", // A=a
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Incorrect username or password", //z duvodu bezpoecnosti nerekneme presne co je spatne
      };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      //validace passwordu hodnoty jsou z docs lucia
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: "Incorrect username or password", //z duvodu bezpoecnosti nerekneme presne co je spatne
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/"); //redirect na main page
  } catch (error) {
    if (isRedirectError(error)) throw error; // musel pridat protoze redirect() haze error kterej chytnu timto "rethrowem" to vyresim
    console.log(error);

    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
