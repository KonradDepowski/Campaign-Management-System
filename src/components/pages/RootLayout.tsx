import { Outlet } from "react-router-dom";
import { AppSidebar } from "../app-sidebar";
import { SiteHeader } from "../site-header";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

const RootLayout = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 18)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default RootLayout;
