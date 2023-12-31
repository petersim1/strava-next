import "@/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import Layout, { Header, Footer } from "@/_components/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strava Easy Viz",
  description: "Application for fun Strava visualizations",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch.png",
    shortcut: "/apple-touch.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
};

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          <Header />
          {children}
          {/* <main>{children}</main> */}
          <Footer />
        </Layout>
      </body>
    </html>
  );
};
