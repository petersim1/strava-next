import "@/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Layout from "@/_components/layout/layout";
import Header from "@/_components/layout/header";
import Footer from "@/_components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strava Easy Viz",
  description: "Application for fun Strava visualizations",
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
