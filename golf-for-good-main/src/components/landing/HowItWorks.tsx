import { motion } from "framer-motion";
import { UserPlus, Target, Shuffle, Heart } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Subscribe",
    description: "Choose a monthly or yearly plan. A portion goes directly to charity.",
    color: "text-primary",
  },
  {
    icon: Target,
    title: "Enter Scores",
    description: "Submit your last 5 Stableford scores. New scores replace the oldest.",
    color: "text-primary",
  },
  {
    icon: Shuffle,
    title: "Monthly Draw",
    description: "Your scores become your draw numbers. Match 3, 4, or all 5 to win.",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "Give Back",
    description: "Part of every subscription supports charities you choose.",
    color: "text-accent",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Four simple steps to start winning and giving.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                STEP {i + 1}
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
