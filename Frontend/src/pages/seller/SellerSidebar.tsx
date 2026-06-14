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
  const [clearUser] = useClearUserMutation()

  const handleSignOut = async () => {
    try {
      await clearUser().unwrap()
      localStorage.removeItem("kartify_role")
      toast.success("User logged out");
      navigate("/login");
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again",
      });
    }
  };

  return (
    <aside className="w-64 border-r bg-background hidden md:flex flex-col min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Seller Center
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your business
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
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
      <div className="p-4 mt-auto space-y-4">
        <div className="rounded-xl bg-primary/10 dark:bg-primary/10 p-4 border border-primary/10 dark:border-primary/20">
          <h4 className="text-sm font-semibold text-primary dark:text-primary">
            Need Help?
          </h4>
          <p className="text-xs text-primary/80 dark:text-primary/80 mt-1 mb-3">
            Check our seller guidelines or contact support.
          </p>
          <button className="text-xs w-full bg-background border shadow-sm py-1.5 rounded-md font-medium text-foreground hover:bg-muted transition-colors">
            Seller Support
          </button>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-lg px-1 py-6 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </div>

          <div className="flex flex-col items-start leading-none">
            <span>Theme</span>
            <span className="mt-1 text-xs font-normal text-muted-foreground capitalize">
              {theme || "system"} mode
            </span>
          </div>
        </Button>
        

        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
