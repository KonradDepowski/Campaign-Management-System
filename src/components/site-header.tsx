import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useQueryWallet from "@/hooks/useQueryWallet";
import { Spinner } from "./ui/spinner";

export function SiteHeader() {
  const { wallet, isLoading, error } = useQueryWallet();

  if (error) {
    return <div>Error loading wallet: {error.message}</div>;
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full justify-between items-center gap-1 px-4 lg:gap-2 lg:px-6 relative">
        <div className="flex">
          <SidebarTrigger className="-ml-1" size="lg" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-8"
          />
        </div>
        <div className="flex flex-row gap-1 items-center justify-center py-3 bg-accent px-3 rounded-md ">
          <h2>Balance</h2>
          {isLoading ? (
            <Spinner />
          ) : (
            <span>{Number(wallet?.balance ?? 0).toFixed(2)} PLN</span>
          )}
        </div>
      </div>
    </header>
  );
}
