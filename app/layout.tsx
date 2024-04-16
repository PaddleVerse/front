import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GridBackground } from "@/components/ui/GridBackground";
import { Boxes } from "@/components/ui/background-boxes";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body
          className={`${inter.className} w-screen h-screen bg-Dark  bg-fixed bg-center bg-no-repeat bg-cover no-scrollbar`}
        >
          {/* <div className="h-full relative w-full overflow-hidden bg-black flex flex-col items-center justify-center">
          <Boxes />
        </div> */}
        <GridBackground></GridBackground>
        {children}
      </body>
    </html>
  );
}
