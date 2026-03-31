import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const tiers = [
  { match: "5-Number Match", share: "40%", rollover: true, label: "Jackpot" },
  { match: "4-Number Match", share: "35%", rollover: false, label: "" },
  { match: "3-Number Match", share: "25%", rollover: false, label: "" },
];

const DrawExplainer = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            The <span className="text-gradient-gold">Draw</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Your 5 golf scores are your draw numbers. Match them to win.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Sample draw numbers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center gap-3 mb-12"
          >
            {[32, 18, 41, 27, 35].map((num, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl gradient-gold flex items-center justify-center shadow-gold"
              >
                <span className="text-xl md:text-2xl font-display font-bold text-primary-foreground">
                  {num}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Prize tiers */}
          <div className="space-y-3">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.match}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-display font-semibold text-foreground">
                      {tier.match}
                    </div>
                    {tier.label && (
                      <span className="text-xs text-primary">{tier.label}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-display font-bold text-foreground">
                    {tier.share}
                  </span>
                  {tier.rollover && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      Rolls Over
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrawExplainer;
