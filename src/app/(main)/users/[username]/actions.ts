"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values); // validujeme values

  const { user } = await validateRequest(); //autorizace usera pomoci validateRequest

  if (!user) throw new Error("Unauthorized"); //kdyz user neni autorizovan-Error

  //updateuser bude vracen na frontEnd at muzeme pozdeji updejtovat ReactQueryFeed pomoci mutating cache
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}
