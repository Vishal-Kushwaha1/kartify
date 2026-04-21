import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <footer className="border-t bg-background text-sm text-muted-foreground">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-base font-medium text-foreground mb-2">
            Karti<span className="text-orange-600">fy</span>
          </h2>
          <p className="text-sm leading-relaxed">
            Your trusted platform for seamless online shopping experience.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <span className="text-foreground font-medium">Shop</span>
          <Link to="/shop">All Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/deals">Deals</Link>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-foreground font-medium">Account</span>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/orders">Orders</Link>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-foreground font-medium">Legal</span>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
        </div>

      </div>

      <div className="border-t px-6 py-4 text-center text-xs">
        © 2026 Kartify. All rights reserved.
      </div>
    </footer>
  )
}