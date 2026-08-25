import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Authorized Workspaces | Tauqeer Mustafa Inc.",
  description: "Private, role-scoped workspaces for authorized accounts.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
