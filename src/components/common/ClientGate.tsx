import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function ClientGate({
  mustBe,
  children,
}: {
  mustBe: "mars" | "santender";
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.client !== mustBe) redirect(`/${mustBe}/not-authorized`);
  return <>{children}</>;
}
