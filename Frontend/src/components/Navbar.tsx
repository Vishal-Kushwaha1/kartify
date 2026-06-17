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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useClearUserMutation, useGetUserQuery } from "@/redux/user/userApi";
import { useGetCartItemQuery } from "@/redux/cart/cartApi";

export const Navbar = () => {
  const { data: user } = useGetUserQuery();
  const [clearUser] = useClearUserMutation();
  const { data: cart } = useGetCartItemQuery();
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
      await clearUser().unwrap();
      sessionStorage.removeItem("kartify_role");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="glass-panel border-border/40 bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold shadow-sm transition-shadow group-hover:shadow-md">
            K
          </div>
          <span className="hidden text-xl font-bold tracking-tight sm:inline-block">
            Karti<span className="text-primary">fy</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hidden rounded-full sm:inline-flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground rounded-full"
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
                className="text-muted-foreground hover:text-foreground rounded-full"
              >
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-foreground relative mr-1 rounded-full"
              >
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="bg-primary text-primary-foreground absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:ring-primary/20 relative ml-2 h-9 w-9 rounded-full ring-2 ring-transparent transition-all"
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
                      <p className="text-muted-foreground w-50 truncate text-sm">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/user" className="flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      to="/add-address"
                      className="flex w-full items-center"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      <span>Add address</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/orders" className="flex w-full items-center">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 dark:focus:bg-red-950/50"
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
                className="hover:text-primary hidden sm:flex"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 rounded-full px-5 shadow-sm transition-all hover:shadow-md"
                asChild
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Search Modal */}
          {searchOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
              <div className="bg-background animate-in fade-in slide-in-from-top-4 mx-4 w-full max-w-2xl rounded-lg shadow-lg">
                <form onSubmit={handleSearch} className="p-6">
                  <div className="flex items-center gap-3">
                    <Search className="text-muted-foreground h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search products, sellers, and more..."
                      className="border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary flex-1 border-b bg-transparent px-2 py-2 transition-colors outline-none"
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
                      className="text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="text-muted-foreground mt-4 text-sm">
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
