import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";

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
        <div className="mx-auto max-w-7xl">{children}</div>{" "}
        {/*{children} of sessionProvider jsou stale server-conpomenty pouze sessionProvider je client-site*/}
      </div>
    </SessionProvider>
  );
}
