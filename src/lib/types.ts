import { Prisma } from "@prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const postDataInclude = {
  user: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude; // satisfies je lepsi pouzit nez psat posDataInclude: type

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude; //dostaneme post type PostData pro dostavani postu s "include" ktere mame definovano na radku 3
}>;
