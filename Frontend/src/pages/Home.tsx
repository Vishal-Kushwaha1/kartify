import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ShieldCheck, Star } from "lucide-react"

const features = [
  {
    icon: <ShoppingCart size={16} />,
    title: "Easy checkout",
    desc: "One-click purchase with saved addresses and payment methods.",
  },
  {
    icon: <ShieldCheck size={16} />,
    title: "Secure payments",
    desc: "Bank-grade encryption on every transaction.",
  },
  {
    icon: <Star size={16} />,
    title: "Top rated sellers",
    desc: "Verified sellers trusted by thousands of users.",
  },
]

export const Home = () => {
  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 border-b bg-background">
        <span className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 mb-4">
          New arrivals every week
        </span>

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
          Everything you need,<br />delivered fast.
        </h1>

        <p className="text-muted-foreground text-base max-w-md mb-6 leading-relaxed">
          Discover quality products across every category — curated, reliable, and affordable.
        </p>

        <div className="flex gap-3">
          <Button className="bg-orange-600 hover:bg-orange-700" asChild>
            <Link to="/shop">Start shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/categories">Browse categories</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b bg-background">
        {features.map((f) => (
          <div key={f.title} className="p-6">
            <div className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center text-orange-700 mb-3">
              {f.icon}
            </div>

            <h3 className="text-sm font-medium mb-1">
              {f.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Promo / CTA block */}
      <section className="px-6 py-16 flex flex-col items-center text-center bg-background border-b">
        <h2 className="text-2xl font-medium tracking-tight mb-3">
          Ready to upgrade your shopping experience?
        </h2>

        <p className="text-muted-foreground max-w-md mb-6 text-sm">
          Join thousands of users already shopping smarter, faster, and safer.
        </p>

        <Button className="bg-orange-600 hover:bg-orange-700" asChild>
          <Link to="/signup">Create account</Link>
        </Button>
      </section>

    </div>
  )
}