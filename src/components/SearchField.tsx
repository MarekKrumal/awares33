"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); //tohle je prvni vec kterou musime pouzit kdyz nepouzivame reacthook-form(nechceme aby se page obnovila chceme ji obnovit pomociJS)
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim(); //takhle ziskame value
    if (!q) return; //empty field se neodesle
    router.push(`/search?q=${encodeURIComponent(q)}`); //kdyz field neni empty chceme pushnout router na novou URL(encodeURIComponent=rusi zakazane charaktery)
  }

  return (
    <form
      onSubmit={handleSubmit}
      method="GET"
      action="/search" /*progressive enhancment search funguje i bez JS*/
    >
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
