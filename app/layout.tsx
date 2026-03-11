import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { FooterVisibilityProvider } from "./FooterVisibilityProvider";
import { FooterWrapper } from "./FooterWrapper";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Notrilho",
  description: "Estação mais próxima da Linha 7 - CPTM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} antialiased min-h-screen bg-white text-zinc-900 font-sans flex flex-col`}>
        <FooterVisibilityProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <FooterWrapper />
        </FooterVisibilityProvider>
      </body>
    </html>
  );
}
