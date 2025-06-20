import type { Metadata } from "next";
import NextJsTopLoader from "@/lib/NextJsTopLoader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";

export const metadata: Metadata = {
  title: "Beginners Google Gemini Ai Course",
  description: "Created by Trae Zeeofor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col justify-center items-center min-h-screen w-full font-trebuchetMs">
        <NextJsTopLoader />
        <StoreProvider>
          <Header />
          <main className="flex-grow h-full w-full">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
