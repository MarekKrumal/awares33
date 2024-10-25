"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: string) {
  const { user } = await validateRequest(); //zkontrolujeme jestli user je authetifikovan

  if (!user) throw Error("Unauthorized"); // user Error nepotrebuje videt, proto to neni error:"Unauthorized"

  const { content } = createPostSchema.parse({ content: input }); //tedka input neni empty protoze, v validations ma createSchema-requiredString

  //new entry do dabaze
  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });
}
