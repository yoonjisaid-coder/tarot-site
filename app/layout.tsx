import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Untold — Free Love Tarot Reading",
  description: "Pick your own cards for love, feelings, contact and reconciliation. A full tarot deck, a clarity card and a message for you. Free, with no sign-up.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
