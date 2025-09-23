import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function AfterLogin() {
  const session = await getSession();
  if (!session) redirect("/login");

  const chosen = session.user.client;
  const clients = session.user.clients ?? [];

  if (!chosen && clients.length > 1) {
    redirect("/choose-client");
  }

  const client = chosen ?? clients[0];
  if (!client) redirect("/login");

  redirect(`/${client}`);
}
