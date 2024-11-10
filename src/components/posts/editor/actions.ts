"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest(); //zkontrolujeme jestli user je authetifikovan

  if (!user) throw new Error("Unauthorized"); // user Error nepotrebuje videt, proto to neni error:"Unauthorized"

  const { content, mediaIds } = createPostSchema.parse(input);
  //new entry do dabaze
  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })), //tady dostaneme kazde id a zmenime ho na object, to updejtuje v schema.prisma Media a prida to postId
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
