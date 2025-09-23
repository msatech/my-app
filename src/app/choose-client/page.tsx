import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import ChooseClientClient from "./ChooseClientClient";

export default async function ChooseClientPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { clients = [], name = "User" } = session.user as any;
  if (clients.length <= 1) redirect("/after-login"); // nothing to choose

  return <ChooseClientClient name={name} clients={clients} />;
}
