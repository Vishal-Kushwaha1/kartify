import { Link } from "react-router-dom";
// import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background/80 text-muted-foreground mt-auto border-t text-sm backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4 lg:grid-cols-5">
        {/* Brand */}
        <div className="space-y-4 lg:col-span-2">
          <Link to="/" className="group flex w-fit items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold shadow-sm">
              K
            </div>
            <h2 className="text-foreground text-xl font-bold tracking-tight">
              Karti<span className="text-primary">fy</span>
            </h2>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed">
            Your trusted platform for a seamless online shopping experience. We
            deliver premium products with zero friction.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <span className="text-foreground mb-1 font-semibold">Shop</span>
          <Link to="/products" className="hover:text-primary transition-colors">
            All Products
          </Link>
          <Link
            to="/add-address"
            className="hover:text-primary transition-colors"
          >
            Address
          </Link>
          <Link
            to="/categories"
            className="hover:text-primary transition-colors"
          >
            Categories
          </Link>
          <Link to="/deals" className="hover:text-primary transition-colors">
            Deals & Offers
          </Link>
          <Link to="/new" className="hover:text-primary transition-colors">
            New Arrivals
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-foreground mb-1 font-semibold">Account</span>
          <Link to="/login" className="hover:text-primary transition-colors">
            Login
          </Link>
          <Link to="/signup" className="hover:text-primary transition-colors">
            Create Account
          </Link>
          <Link to="/apply" className="hover:text-primary transition-colors">
            Become A Seller
          </Link>
          <Link to="/orders" className="hover:text-primary transition-colors">
            Track Orders
          </Link>
          <Link to="/wishlist" className="hover:text-primary transition-colors">
            My Wishlist
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-foreground mb-1 font-semibold">
            Legal & Support
          </span>
          <Link to="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link to="#" className="hover:text-primary transition-colors">
            FAQ
          </Link>
          <Link to="#" className="hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>
      </div>

      <div className="border-border/50 mx-auto flex max-w-7xl flex-col items-center justify-center border-t px-6 py-6 text-center md:flex-row">
        <p className="text-xs">© 2026 Kartify. All rights reserved.</p>
      </div>
    </footer>
  );
};
