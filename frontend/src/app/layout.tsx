import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Trace Viewer",
  description: "A visualizer for LLM call traces and logs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
