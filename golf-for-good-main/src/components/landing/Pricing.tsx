import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Monthly",
    price: "₹999",
    period: "/month",
    features: [
      "Enter 5 Stableford scores",
      "Monthly prize draw entry",
      "Choose your charity",
      "Performance dashboard",
      "Email notifications",
    ],
    featured: false,
  },
  {
    name: "Yearly",
    price: "₹8,999",
    period: "/year",
    badge: "Save 25%",
    features: [
      "Everything in Monthly",
      "2 bonus draw entries",
      "Priority winner verification",
      "Yearly performance report",
      "Exclusive charity events access",
    ],
    featured: true,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Simple <span className="text-gradient-gold">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            One subscription. Prizes + charity impact included.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-xl p-8 ${
                plan.featured
                  ? "glass-card border-primary/40 glow-gold"
                  : "glass-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-gold text-xs font-bold text-primary-foreground">
                  {plan.badge}
                </div>
              )}

              {plan.featured && (
                <Star className="absolute top-6 right-6 w-5 h-5 text-primary" />
              )}

              <h3 className="text-lg font-display font-semibold text-foreground mb-1">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-display font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button
                  className={`w-full font-semibold ${
                    plan.featured
                      ? "gradient-gold text-primary-foreground shadow-gold hover:opacity-90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  } transition-all`}
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
