import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Icon } from "../components/Icon";
import { WorkspaceProvider } from "../lib/workspace-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nomad — Build a space that moves with you",
  description: "Design and rent a workspace made for wherever you land.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <WorkspaceProvider>
          <header className="site-header">
            <div className="shell site-header-inner">
              <Link href="/" className="brand" aria-label="Nomad home">
                <span className="brand-mark"><span /><span /><span /></span>
                <span>nomad<span className="brand-slash">/</span>studio</span>
              </Link>
              <div className="header-center">FURNITURE FOR THE IN-BETWEEN PLACES</div>
              <Link href="/checkout" className="header-link">Your setup <Icon name="arrow-right" size={15} /></Link>
            </div>
          </header>
          {children}
        </WorkspaceProvider>
      </body>
    </html>
  );
}
