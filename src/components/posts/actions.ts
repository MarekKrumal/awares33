"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post not found");

  if (post.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: getPostDataInclude(user.id),
  });

  return deletedPost;
}
/**
 * Vytvoření repostu – založí nový Post s vyplněným originalPostId
 */
export async function submitRepost(originalPostId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  // Zkontrolujeme, jestli původní příspěvek existuje
  const originalPost = await prisma.post.findUnique({
    where: { id: originalPostId },
    include: { attachments: true }, // Načteme přílohy pro kontrolu
  });

  if (!originalPost) {
    throw new Error("Original post not found.");
  }

  // Vytvoříme repost
  const repost = await prisma.post.create({
    data: {
      content: originalPost.content, // Převezme obsah původního příspěvku
      userId: user.id,
      originalPostId, // Nastavíme odkaz na původní příspěvek
    },
    include: getPostDataInclude(user.id),
  });

  return repost;
}
