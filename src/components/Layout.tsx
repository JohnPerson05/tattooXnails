"use client";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import PageTransition from "./PageTransition";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 md:pt-20">{children}</main>
        <Footer />
        <ScrollToTop />
      </div>
    </PageTransition>
  );
};

export default Layout;
