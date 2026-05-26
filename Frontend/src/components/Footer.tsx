import { Link } from "react-router-dom";
// import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm text-sm text-muted-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4 lg:grid-cols-5">

        {/* Brand */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
              K
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Karti<span className="text-primary">fy</span>
            </h2>
          </Link>
          <p className="text-sm leading-relaxed max-w-sm">
            Your trusted platform for a seamless online shopping experience. We deliver premium products with zero friction.
          </p>
          {/* <div className="flex items-center gap-4 pt-2">
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></Link>
          </div> */}
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <span className="text-foreground font-semibold mb-1">Shop</span>
          <Link to="/products" className="hover:text-primary transition-colors">All Products</Link>
          <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <Link to="/deals" className="hover:text-primary transition-colors">Deals & Offers</Link>
          <Link to="/new" className="hover:text-primary transition-colors">New Arrivals</Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-foreground font-semibold mb-1">Account</span>
          <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
          <Link to="/signup" className="hover:text-primary transition-colors">Create Account</Link>
          <Link to="/apply" className="hover:text-primary transition-colors">Become A Seller</Link>
          <Link to="/orders" className="hover:text-primary transition-colors">Track Orders</Link>
          <Link to="/wishlist" className="hover:text-primary transition-colors">My Wishlist</Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-foreground font-semibold mb-1">Legal & Support</span>
          <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-primary transition-colors">FAQ</Link>
          <Link to="#" className="hover:text-primary transition-colors">Contact Us</Link>
        </div>

      </div>

      <div className="border-t border-border/50 px-6 py-6 text-center flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <p className="text-xs">© 2026 Kartify. All rights reserved.</p>
        <p className="text-xs mt-2 md:mt-0 flex items-center gap-1">
          Designed with <span className="text-red-500">♥</span> for a better web.
        </p>
      </div>
    </footer>
  );
};