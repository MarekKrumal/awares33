import { PrismaAdapter } from "@lucia-auth/adapter-prisma"; //https://lucia-auth.com/ pro vice informaci
import prisma from "./lib/prisma";
import { Lucia, Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";

const adapter = new PrismaAdapter(prisma.session, prisma.user); //Prisma adapter potrebuje tyto modely

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false, // sessionCookie navzdy available(zajimava poznamka s JWT by tu byl problem, nemohli bych nasilu nekoho odhlasit kdyby byl ucet v ohrozeni)
    attributes: {
      secure: process.env.NODE_ENV === "production", //chceme pouzit secure cookie pouze v production
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
    //tedka pokazde co fetchneme data ve frontendu automaticky pracujeme s databazi a nemusime to delat v databazi zvlast
  },
});

declare module "lucia" {
  //tohle musime udelat aby jsme napojili databaseUserAttributes do lucia
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  //musime zadefinovat vsechno co budeme potrebovat pozdeji ve frontendu
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    return result;
  },
);
