import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import { api } from "@/lib/api";

type Charity = {
  id: number;
  name: string;
  description: string;
  image_url?: string;
};

const Charities = () => {
  const [search, setSearch] = useState("");
  const [allCharities, setAllCharities] = useState<Charity[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const data = await api.getCharities();
        setAllCharities(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load charities",
        );
      }
    };

    load();
  }, []);

  const filtered = allCharities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Charity <span className="text-gradient-emerald">Directory</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Browse and choose the causes you want to support with your
            subscription.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search charities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground"
            />
          </div>
        </div>

        {error ? (
          <p className="text-sm text-destructive mb-6">{error}</p>
        ) : null}

        {/* Charity Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((charity, i) => (
            <motion.div
              key={charity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 hover:border-accent/30 transition-colors group"
            >
              <div className="text-4xl mb-4">
                {charity.image_url ? "🫶" : "⛳"}
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                {charity.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                {charity.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Registered charity
                  </div>
                  <div className="text-sm font-display font-bold text-accent">
                    Support through subscription
                  </div>
                </div>
                <Heart className="w-5 h-5 text-accent/40 group-hover:text-accent transition-colors cursor-pointer" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Charities;
