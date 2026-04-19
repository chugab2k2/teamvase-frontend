import RouteShell from "@/components/RouteShell";

export const metadata = {
  title: "TeamVase App",
  description: "AI Project Controls Copilot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        <RouteShell>{children}</RouteShell>
      </body>
    </html>
  );
}