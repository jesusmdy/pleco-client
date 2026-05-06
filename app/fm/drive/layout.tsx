import { Header } from "@/app/components/layout/header";
import { Sidebar } from "@/app/components/layout/sidebar";

export default function DriveLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen overflow-hidden bg-md-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-md-outline-variant/10">
          {children}
        </main>
      </div>
    </div>
  );
}
