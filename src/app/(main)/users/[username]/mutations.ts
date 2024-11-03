import { useToast } from "@/components/ui/use-toast";
import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";

export function useUpdateProfileMutation() {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar"); //avatar z core.ts

  const mutation = useMutation({
    mutationFn: async ({
      values, //userprofilevalues
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File; //avatar je nepovinny
    }) => {
      //chceme updejtnout nas profile v databazia nahrat avatar? a chci obe operace provest zaroven pomoci Promise.all
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]), //avatar je v [array] protoze uploadthing podporuje upload vice veci
      ]);
    },

    //onSucces funkce dostane vse co returneme z mutation funkce (Promise.all) - startAvatarUpload vrati uploadResult
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl; //upload result muze byt undefined, [0]-pouzili jsme array v startAvatarUpload, serverData.avatarUrl(core.ts)

      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"], //post-feed chceme updejtnout kdekoliv kde je post s nasim avatatarem tam bude updejtnuta cache se jmenem biem a avatarem
      };

      await queryClient.cancelQueries(queryFilter); //musime cancelnou queries pred mutaci

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return; // kdyz olddata jsou undefined tak nic

          //kdyz oldData jsou defined tak chceme vzit kazdy post a chceme ho updejtnout, takhle se updejtuje state v reactu  map/filter calls
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                return post; //vratime post nechceme ho modifikovat narozdil od bio,name,avatar
              }),
            })),
          };
        },
      );

      router.refresh(); //tohle updejtuje server component s novymi daty

      toast({
        description: "Profile updated",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}
