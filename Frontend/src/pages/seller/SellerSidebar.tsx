import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  LogOut,
  Moon,
  Sun,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { useTheme } from "next-themes";
import { useClearUserMutation } from "@/redux/user/userApi";

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/seller",
  },
  {
    title: "My Products",
    icon: Package,
    href: "/seller/products",
  },
  {
    title: "Add Product",
    icon: PlusCircle,
    href: "/seller/add",
  },
  {
    title: "Orders",
    icon: ShoppingBag,
    href: "/seller/orders",
  },
  {
    title: "Store",
    icon: Store,
    href: "/seller/store",
  },
];

export const SellerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [clearUser] = useClearUserMutation();

  const handleSignOut = async () => {
    try {
      await clearUser().unwrap();
      sessionStorage.removeItem("kartify_role");
      toast.success("User logged out");
      navigate("/login");
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again",
      });
    }
  };

  return (
    <aside className="bg-background flex h-full min-h-screen w-64 flex-col border-r shadow-lg md:shadow-none">
      <div className="p-6">
        <h2 className="text-primary text-xl font-bold tracking-tight">
          Seller Center
        </h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Manage your business
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {sidebarLinks.map((item) => {
          // Check active state
          // e.g. if href is /seller, it should strictly match or else /seller/products would make it active
          const isActive =
            item.href === "/seller"
              ? location.pathname === "/seller" ||
                location.pathname === "/seller/"
              : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary dark:bg-primary/10 dark:text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary dark:text-primary" : "",
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* A small help card at the bottom */}
      <div className="mt-auto space-y-4 p-4">
        <div className="bg-primary/10 dark:bg-primary/10 border-primary/10 dark:border-primary/20 rounded-xl border p-4">
          <h4 className="text-primary dark:text-primary text-sm font-semibold">
            Need Help?
          </h4>
          <p className="text-primary/80 dark:text-primary/80 mt-1 mb-3 text-xs">
            Check our seller guidelines or contact support.
          </p>
          <button className="bg-background text-foreground hover:bg-muted w-full rounded-md border py-1.5 text-xs font-medium shadow-sm transition-colors">
            Seller Support
          </button>
        </div>

        <Button
          variant="ghost"
          className="text-muted-foreground hover:bg-muted hover:text-foreground w-full justify-start gap-3 rounded-lg px-1 py-6 text-sm font-medium transition-all duration-200"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </div>

          <div className="flex flex-col items-start leading-none">
            <span>Theme</span>
            <span className="text-muted-foreground mt-1 text-xs font-normal capitalize">
              {theme || "system"} mode
            </span>
          </div>
        </Button>

        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
