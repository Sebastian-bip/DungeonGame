import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terminal RPG",
  description: "Prosta przeglądarkowa gra RPG w terminalu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        {children}
      </body>
    </html>
  );
}