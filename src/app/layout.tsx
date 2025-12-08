import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import "./globals.css";
import { Header } from '@/components/layouts/Header';

export const metadata: Metadata = {
  title: "Platemates",
  description: "Share meals with mates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}