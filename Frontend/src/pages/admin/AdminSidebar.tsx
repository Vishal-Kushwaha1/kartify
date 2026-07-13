import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Clock,
  ShoppingCart,
  LogOut,
  Moon,
  Sun,
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
    href: "/admin",
  },
  {
    title: "Sellers",
    icon: Package,
    href: "/admin/seller",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/user",
  },
  {
    title: "Pending Approvals",
    icon: Clock,
    href: "/admin/pending",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
];

const AdminSidebar = () => {
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
    <aside className="bg-card z-10 flex h-full min-h-screen w-64 flex-col border-r shadow-xl md:shadow-sm">
      <div className="bg-muted/20 border-b p-6">
        <h2 className="text-primary text-xl font-bold tracking-tight">
          Admin Center
        </h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Control your business
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {sidebarLinks.map((item) => {
          // Check active state
          // e.g. if href is /seller, it should strictly match or else /seller/products would make it active
          const isActive =
            item.href === "/admin"
              ? location.pathname === "/admin" ||
                location.pathname === "/admin/"
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

      <div className="bg-muted/10 border-t p-4">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:bg-muted hover:text-foreground w-full justify-start gap-3 rounded-lg px-3 py-6 text-sm font-medium transition-all duration-200"
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

export default AdminSidebar;
