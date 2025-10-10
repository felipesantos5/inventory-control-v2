import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { SidebarCustom } from "@/components/siderBar";

const Layout = () => {
  return (
    <SidebarProvider>
      <SidebarCustom />
      <main className="w-full">
        <SidebarTrigger />
        <section className="container-custom py-4">
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
