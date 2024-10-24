import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest(); //validateReq = validate funciton(jestli jsme lognuti) kterou jsem vytvoril nam zacatku

  if (user) redirect("/"); //jestli jse user prihlasen chceme ho redirectovat na FP

  return <>{children}</>; // redirect:RedirectType): never ==> to znamena ze nikdy return nebude pouzit
}
