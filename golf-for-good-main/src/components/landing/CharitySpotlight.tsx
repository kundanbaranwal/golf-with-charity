import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const charities = [
  {
    name: "Golf for Youth",
    description:
      "Introducing underprivileged youth to the sport of golf through mentorship and training.",
    raised: "₹4,200",
    image: "🏌️",
  },
  {
    name: "Green Futures",
    description:
      "Sustainable golf course management and environmental conservation efforts.",
    raised: "₹3,800",
    image: "🌱",
  },
  {
    name: "Swing for Health",
    description:
      "Supporting mental health awareness through outdoor sports and community events.",
    raised: "₹5,100",
    image: "💚",
  },
];

const CharitySpotlight = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-accent/[0.02]" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Charity <span className="text-gradient-emerald">Spotlight</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every subscription makes a difference. Choose where your impact
            goes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {charities.map((charity, i) => (
            <motion.div
              key={charity.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-accent/30 transition-colors group"
            >
              <div className="text-4xl mb-4">{charity.image}</div>
              <h3 className="text-lg font-display font-semibold mb-2 text-foreground">
                {charity.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {charity.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Total Raised
                  </div>
                  <div className="text-lg font-display font-bold text-accent">
                    {charity.raised}
                  </div>
                </div>
                <Heart className="w-5 h-5 text-accent/50 group-hover:text-accent transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/charities">
            <Button
              variant="outline"
              className="border-accent/30 text-accent hover:bg-accent/10"
            >
              View All Charities
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CharitySpotlight;
