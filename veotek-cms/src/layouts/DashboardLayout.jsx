import { useCallback, useState } from "react";

import Header from "../components/layout/Header";
import MobileSidebar from "../components/layout/MobileSidebar";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-dark text-light">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 lg:block">
        <Sidebar />
      </aside>

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      <div className="min-h-screen lg:pl-72">
        <Header onOpenSidebar={openMobileSidebar} />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}