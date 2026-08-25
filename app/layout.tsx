import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Client Workspace",
  description: "A private workspace for authorized clients.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
