import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import MenuBar from "./MenuBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest(); //validateReq = validate funciton(jestli jsme lognuti) kterou jsem vytvoril nam zacatku

  if (!session.user) redirect("/login"); //jestli user neni prihlasen chceme byt prerazeni na login

  return (
    // vezmeme session a udelame ji pristupnou client componentum at ji nemusime fetchovat znovu v clientu

    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
        {/*{children} of sessionProvider jsou stale server-conpomenty pouze sessionProvider je client-site*/}
      </div>
    </SessionProvider>
  );
}
