import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/app/(main)/SessionProvider";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { PostsPage } from "@/lib/types";
import { submitRepost } from "./actions";

export function useRepostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitRepost,
    onSuccess: async (newRepost) => {
      // Query Filter: chceme updatovat feed "for-you", apod.
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];
          if (!firstPage) return oldData;

          // Nový repost přidáme jako nový post na začátek feedu
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                posts: [newRepost, ...firstPage.posts],
                nextCursor: firstPage.nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );

      // Invalidační logika jen pro případy, kde zatím nebyly data
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({
        description: "Repost created!",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    },
  });

  return mutation;
}
