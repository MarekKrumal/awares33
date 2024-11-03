"use client";

import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserTooltip from "./UserTooltip";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string; //nemame zadna jina data nemame zatim zadna user data
}

export default function UserLinkWithTooltip({
  children,
  username,
}: UserLinkWithTooltipProps) {
  const { data } = useQuery({
    queryKey: ["user-data", username], //nastavime userkey je dulezite ze username je soucasti klice
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),

    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false; //nechceme retry
      }
      return failureCount < 3; //pri jine errory (vsechny krome 404) retry zkusime 3x
    },
    staleTime: Infinity, //neni potreba refetch user informace porad dokola staci jednou
  });

  //kdyz nemame userdata chceme vratit poouze Link
  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }
  //ale kdyz data existuji vratime Link v UserTooltip
  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
}

//tuto komponentu pouzijime v Linkify.tsx tam Linkifijujeme nase username
