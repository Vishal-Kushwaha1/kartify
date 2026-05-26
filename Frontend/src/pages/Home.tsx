import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck, Star, ArrowRight, Zap, Gift } from "lucide-react";

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
  { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop" },
  { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&auto=format&fit=crop" },
  { name: "Home & Living", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=500&auto=format&fit=crop" },
];

export const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative px-6 py-32 md:py-48 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[20%] left-[20%] w-160 h-160 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] right-[20%] w-140 h-140 bg-rose-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <span className="flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-muted border text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={14} className="text-primary" />
            Discover our new Summer Collection
          </span>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Elevate Your <br className="hidden md:block" />
            <span className="gradient-text">Shopping Experience</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Discover a curated universe of premium products. Fast delivery, impeccable quality, and seamless transactions at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Button size="lg" className="h-14 px-8 rounded-full text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all" asChild>
              <Link to="/products">
                Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base bg-background/50 backdrop-blur-sm hover:bg-muted transition-all" asChild>
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Trending Categories</h2>
              <p className="text-muted-foreground">Shop the most popular categories this week.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex hover-lift" asChild>
              <Link to="/categories">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingCategories.map((cat) => (
              <Link key={cat.name} to={`/categories/${cat.name.toLowerCase()}`} className="group relative h-80 rounded-3xl overflow-hidden glass-card">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                  <span className="inline-flex items-center text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    Shop now <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-y bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-center md:items-start space-y-4 p-6 rounded-3xl hover:bg-muted/50 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center shadow-sm">
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
      <section className="relative py-32 px-6 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <Gift className="w-16 h-16 mx-auto opacity-80 mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Join the Kartify Community
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Create an account today and get 15% off your first premium order. Experience shopping redefined.
          </p>
          <Button size="lg" variant="secondary" className="h-14 px-10 rounded-full text-base font-semibold hover:-translate-y-1 hover:shadow-xl transition-all" asChild>
            <Link to="/signup">Claim Your Discount</Link>
          </Button>
        </div>
      </section>

    </div>
  );
};