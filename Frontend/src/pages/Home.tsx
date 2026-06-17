import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  ShieldCheck,
  Star,
  ArrowRight,
  Zap,
  Gift,
} from "lucide-react";

const features = [
  {
    icon: <ShoppingCart size={24} className="text-primary" />,
    title: "Seamless Checkout",
    desc: "Experience frictionless one-click purchases with saved presets.",
  },
  {
    icon: <ShieldCheck size={24} className="text-blue-500" />,
    title: "Ironclad Security",
    desc: "Your data is protected with military-grade encryption.",
  },
  {
    icon: <Star size={24} className="text-yellow-500" />,
    title: "Premium Quality",
    desc: "Curated selection from top-tier, verified global brands.",
  },
];

const trendingCategories = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=500&auto=format&fit=crop",
  },
];

export const Home = () => {
  return (
    <div className="bg-background flex min-h-screen flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-32 text-center md:py-48">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 h-full w-full max-w-7xl -translate-x-1/2">
          <div className="bg-primary/10 absolute top-[20%] left-[20%] h-160 w-160 rounded-full blur-3xl" />
          <div className="absolute right-[20%] bottom-[10%] h-140 w-140 rounded-full bg-rose-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
          <span className="bg-muted text-muted-foreground animate-in fade-in slide-in-from-bottom-4 mb-8 flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold duration-700">
            <Zap size={14} className="text-primary" />
            Discover our new Summer Collection
          </span>

          <h1 className="animate-in fade-in slide-in-from-bottom-6 mb-6 text-5xl leading-tight font-bold tracking-tight delay-100 duration-700 md:text-7xl">
            Elevate Your <br className="hidden md:block" />
            <span className="gradient-text">Shopping Experience</span>
          </h1>

          <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-8 mb-10 max-w-2xl text-lg leading-relaxed delay-200 duration-700 md:text-xl">
            Discover a curated universe of premium products. Fast delivery,
            impeccable quality, and seamless transactions at your fingertips.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-10 flex flex-col gap-4 delay-300 duration-700 sm:flex-row">
            <Button
              size="lg"
              className="shadow-primary/25 hover:shadow-primary/40 h-14 rounded-full px-8 text-base shadow-lg transition-all hover:-translate-y-1"
              asChild
            >
              <Link to="/products">
                Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-background/50 hover:bg-muted h-14 rounded-full px-8 text-base backdrop-blur-sm transition-all"
              asChild
            >
              <Link to="/products">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">
                Trending Categories
              </h2>
              <p className="text-muted-foreground">
                Shop the most popular categories this week.
              </p>
            </div>
            <Button
              variant="ghost"
              className="hover-lift hidden sm:flex"
              asChild
            >
              <Link to="/products">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {trendingCategories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products`}
                className="group glass-card relative h-80 overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 z-10 bg-black/40 transition-colors group-hover:bg-black/20" />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full transform object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 z-20 p-8">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                    Shop now <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background border-y px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:text-left">
            {features.map((f) => (
              <div
                key={f.title}
                className="hover:bg-muted/50 flex flex-col items-center space-y-4 rounded-3xl p-6 transition-colors md:items-start"
              >
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground relative overflow-hidden px-6 py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
          <Gift className="mx-auto mb-6 h-16 w-16 opacity-80" />
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Join the Kartify Community
          </h2>
          <p className="text-primary-foreground/80 mx-auto max-w-2xl text-lg md:text-xl">
            Create an account today and get 15% off your first premium order.
            Experience shopping redefined.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-14 rounded-full px-10 text-base font-semibold transition-all hover:-translate-y-1 hover:shadow-xl"
            asChild
          >
            <Link to="/signup">Claim Your Discount</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};
