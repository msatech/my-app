import { getSession } from "@/lib/auth/session";
import SantenderDashboardClient from "./_components/SantenderDashboardClient";

export default async function SantenderLanding() {
  const session = await getSession();
  const name = session?.user?.name ?? "John";
  return <SantenderDashboardClient name={name} />;
}
