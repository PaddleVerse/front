import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ContentWrapper from "./ContentWrapper";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PongPing",
  description: "NN PongPing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <section
        className={`${inter.className} w-screen h-screen bg-[#15202E] bg-fixed bg-center bg-no-repeat bg-cover overflow-y-hidden`}
      >
        <ContentWrapper>
        {children}
        <Toaster position="top-right"/>
        </ContentWrapper>
      </section>
  );
}
