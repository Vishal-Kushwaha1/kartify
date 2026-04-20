import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b bg-background">
      
      <span className="text-lg font-medium tracking-tight">
        Karti<span className="text-orange-600">fy</span>
      </span>

      <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
        <Link to="/shop">Shop</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/deals">Deals</Link>
      </nav>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/login">Log in</Link>
        </Button>

        <Button size="sm" className="bg-orange-600 hover:bg-orange-700" asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>
    </header>
  )
}