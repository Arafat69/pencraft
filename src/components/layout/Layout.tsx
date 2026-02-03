import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "@/components/BackToTop";
import NoticeBar from "@/components/NoticeBar";
import PopupNotice from "@/components/PopupNotice";
import PageLoader from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isLoading = usePageLoading();

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <PageLoader />}
      <PopupNotice />
      <NoticeBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}