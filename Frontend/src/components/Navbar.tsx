import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Package,
  LogOut,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clearUser } from "@/redux/user/userSlice";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/authClient.ts";
import { useState } from "react";

export const Navbar = () => {
  const { user } = useAppSelector((state) => state.user);
  const { cart } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemsCount = cart?.length || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      dispatch(clearUser());
      localStorage.removeItem("kartify_recommendation")
      localStorage.removeItem("kartify_role")
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-border/40 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg shadow-sm group-hover:shadow-md transition-shadow">
            K
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
            Karti<span className="text-primary">fy</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full relative text-muted-foreground hover:text-foreground mr-1"
              >
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ml-2 ring-2 ring-transparent hover:ring-primary/20 transition-all"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.image || ""} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-50 truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/user" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      to="/add-address"
                      className="flex items-center w-full"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      <span>Add address</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/orders" className="flex items-center w-full">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600  dark:focus:bg-red-950/50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:flex hover:text-primary"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 rounded-full px-5 shadow-sm hover:shadow-md transition-all"
                asChild
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}

        {/* Search Modal */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
            <div className="w-full max-w-2xl mx-4 rounded-lg bg-background shadow-lg animate-in fade-in slide-in-from-top-4">
              <form onSubmit={handleSearch} className="p-6">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products, sellers, and more..."
                    className="flex-1 bg-transparent border-b border-border/50 px-2 py-2 outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  {searchQuery ? (
                    <p>Press Enter to search for "{searchQuery}"</p>
                  ) : (
                    <p>Start typing to search...</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
        {searchOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          />
        )}
        </div>
      </div>
    </header>
  );
};
