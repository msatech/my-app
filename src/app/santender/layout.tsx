import ClientGate from "@/components/common/ClientGate";
import { getTheme } from "@/lib/theme";
import ThemeProvider from "@/providers/ThemeProvider";
import SantenderHeader from "./_components/SantenderHeader";

export default function SantenderLayout({ children }: { children: React.ReactNode }) {
  const tokens = getTheme("santender");
  return (
    <ClientGate mustBe="santender">
      <ThemeProvider client="santender" tokens={tokens}>
        <main className="relative min-h-screen">
          {/* Warm page gradient behind everything (top-right) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(1000px 520px at 85% -5%, rgba(226,27,27,0.10), rgba(255,153,128,0.08) 45%, rgba(253,247,242,0.00) 70%)",
            }}
          />
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="bg-transparent mb-4">
            <SantenderHeader initial={("J").toUpperCase()} />
            </div>
            {children}
            </div>
        </main>
      </ThemeProvider>
    </ClientGate>
  );
}
