import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { api } from "@/lib/api";
import { setSession } from "@/lib/auth";

type Charity = {
  id: number;
  name: string;
};

const Signup = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [charityPercent, setCharityPercent] = useState([10]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [planType, setPlanType] = useState<"monthly" | "yearly">("monthly");
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharityId, setSelectedCharityId] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  useEffect(() => {
    const loadCharities = async () => {
      try {
        const data = await api.getCharities();
        setCharities(data);
        if (data.length > 0) {
          setSelectedCharityId(String(data[0].id));
        }
      } catch {
        setError("Failed to load charities");
      }
    };

    loadCharities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError("Please fill full name, email, and password to continue");
        return;
      }

      if (!isValidEmail(email.trim())) {
        setError("Please enter a valid email address");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      setError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      setError("");
      setStep(3);
      return;
    }

    if (!selectedCharityId) {
      setError("Please select a charity to continue");
      return;
    }

    if (step < 3) {
      setError("");
      setStep(step + 1);
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      await api.signup({
        name,
        email,
        password,
        charity_id: selectedCharityId ? Number(selectedCharityId) : null,
        charity_percentage: charityPercent[0],
      });

      const { token, user } = await api.login({ email, password });
      setSession(token, user);

      await api.createSubscription({ planType, paymentGateway: "razorpay" });

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              GolfGives
            </span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Join GolfGives
          </h1>
          <p className="text-muted-foreground">Step {step} of 3</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "gradient-gold" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label className="text-foreground">Full Name</Label>
                  <Input
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-display font-semibold text-foreground">
                  Choose Your Plan
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Monthly", price: "₹999/mo" },
                    { name: "Yearly", price: "₹8,999/yr" },
                  ].map((plan) => (
                    <label
                      key={plan.name}
                      className="glass-card p-4 cursor-pointer hover:border-primary/40 transition-colors has-[:checked]:border-primary/60 has-[:checked]:glow-gold"
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.name}
                        checked={
                          (plan.name === "Monthly" && planType === "monthly") ||
                          (plan.name === "Yearly" && planType === "yearly")
                        }
                        onChange={() =>
                          setPlanType(
                            plan.name === "Monthly" ? "monthly" : "yearly",
                          )
                        }
                        className="sr-only"
                      />
                      <div className="font-display font-semibold text-foreground">
                        {plan.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {plan.price}
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-display font-semibold text-foreground">
                  Choose Your Charity
                </h3>
                <Select
                  value={selectedCharityId}
                  onValueChange={setSelectedCharityId}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Select a charity" />
                  </SelectTrigger>
                  <SelectContent>
                    {charities.map((charity) => (
                      <SelectItem key={charity.id} value={String(charity.id)}>
                        {charity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-foreground">
                      Charity Contribution
                    </Label>
                    <span className="text-sm font-display font-bold text-accent">
                      {charityPercent[0]}%
                    </span>
                  </div>
                  <Slider
                    value={charityPercent}
                    onValueChange={setCharityPercent}
                    min={10}
                    max={30}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    You must donate at least 10% and up to 30% of your
                    subscription
                  </p>
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity"
            >
              {isLoading
                ? "Creating account..."
                : step < 3
                  ? "Continue"
                  : "Start Subscription"}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
