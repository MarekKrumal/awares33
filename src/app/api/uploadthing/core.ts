import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" }, //na frontendu udelame resize aby jsme usetrili data
  })
    //middleware bude spusten na nasem serveru pri kazdem uploudu pridame AUTH
    .middleware(async () => {
      const { user } = await validateRequest(); //pomoci validateReq dostaneme loggedin user

      if (!user) throw new UploadThingError("Unauthorized"); //kdyz user neni prihlasen dostaneme error primo z  uploadthing/server

      return { user }; // co dostaneme v returnu zde bude poslano do funkce .onUploadComplete
    })
    //metadata obsahuji to vracime nahore return { user };
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl; //oldAvatarUrl dostaneme z return { user }, avatarUrl=currentavatarURL

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1]; //zkontrolujeme jestli existuje avatar pak potrebujeme key a key je soucast URL

        await new UTApi().deleteFiles(key); //pomoci key smazeme oldAvatar, pomoci UTApi mame pristup k uploadthing API primo
      }

      const newAvatarUrl = file.url.replace(
        "/f/", //defaut URL
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`, //correctURL
      ); // pro bezpecnost chceme vzdy pouzit URL kterou vlastnime https://docs.uploadthing.com/working-with-files

      //tedka mame avatarURL specifikovanou pro nasi APP_ID a to chceme pridat k userovi:
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });

      return { avatarUrl: newAvatarUrl }; //toto budu returnoto na forntend pouzijeme to na okamzity update cache
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
