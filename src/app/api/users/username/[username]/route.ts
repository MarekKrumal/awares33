import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { username } }: { params: { username: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest(); // dostaneme loggedInusera z validateReq

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 }); //kdyz nejsme loggedIn jsme Unauthorized
    }

    //fetching user
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive", // A=a
        },
      },
      select: getUserDataSelect(loggedInUser.id), //potrebujeme follower info
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 }); // cekneme jestli user neni (null)
    }

    return Response.json(user); //jestli byl user nalezen chceme vratit usera v .json
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
