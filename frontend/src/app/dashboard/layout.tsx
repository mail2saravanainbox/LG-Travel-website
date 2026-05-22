import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist">
      <DashboardSidebar />
      <div className="lg:pl-72">
        <main className="px-5 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
