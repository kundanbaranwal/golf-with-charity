import { Trophy, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">GolfGives</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/charities" className="hover:text-foreground transition-colors">Charities</Link>
            <Link to="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="w-3.5 h-3.5 text-accent" /> for charity
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
