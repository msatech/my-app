import ClientGate from "@/components/common/ClientGate";
import { getTheme } from "@/lib/theme";
import ThemeProvider from "@/providers/ThemeProvider";
import MarsHeader from "./_components/MarsHeader";

export default function MarsLayout({ children }: { children: React.ReactNode }) {
  const tokens = getTheme("mars");
  return (
    <ClientGate mustBe="mars">
      <ThemeProvider client="mars" tokens={tokens}>
        <MarsHeader />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </ThemeProvider>
    </ClientGate>
  );
}
