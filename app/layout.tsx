import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Database Report Generator",
  description: "Remote database AI-powered report generation tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
