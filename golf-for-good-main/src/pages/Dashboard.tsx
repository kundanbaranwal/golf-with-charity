/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  CreditCard,
  Target,
  Heart,
  Shuffle,
  Award,
  Plus,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { clearSession, getStoredUser } from "@/lib/auth";

type Score = { id: number; score: number; date: string };
type Subscription = { plan: string; status: string; renewal_date: string };
type Charity = { id: number; name: string };
type Draw = {
  id: number;
  draw_date: string;
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num5: number;
};
type Winner = { id: number; status: string; prize_amount: number | null };

const Dashboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<Score[]>([]);
  const [newScore, setNewScore] = useState("");
  const [newDate, setNewDate] = useState("");
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [me, setMe] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [charityName, setCharityName] = useState("Not selected");
  const [latestDraw, setLatestDraw] = useState<Draw | null>(null);
  const [myWinners, setMyWinners] = useState<Winner[]>([]);

  const totalWinnings = useMemo(
    () => myWinners.reduce((sum, w) => sum + Number(w.prize_amount || 0), 0),
    [myWinners],
  );

  useEffect(() => {
    const boot = async () => {
      const storedUser = getStoredUser();
      if (!storedUser) {
        navigate("/login");
        return;
      }

      if (storedUser.isAdmin) {
        navigate("/admin");
        return;
      }

      try {
        setError("");
        const [
          meData,
          scoresData,
          subData,
          charitiesData,
          drawData,
          winnersData,
        ] = await Promise.all([
          api.me(),
          api.getScores(),
          api.getSubscription().catch(() => null),
          api.getCharities(),
          api.getLatestDraw().catch(() => null),
          api.getMyWinners().catch(() => []),
        ]);

        setMe(meData);
        setScores(scoresData || []);
        setSubscription(subData);
        setLatestDraw(drawData);
        setMyWinners(winnersData || []);

        const currentCharity = (charitiesData || []).find(
          (c: Charity) => c.id === meData.charity_id,
        );
        if (currentCharity) setCharityName(currentCharity.name);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    };

    boot();
  }, [navigate]);

  const addScore = async () => {
    const scoreNum = parseInt(newScore);
    if (!(scoreNum >= 1 && scoreNum <= 45 && newDate)) return;

    try {
      await api.addScore({ score: scoreNum, date: newDate });
      const refreshedScores = await api.getScores();
      setScores(refreshedScores);
      setNewScore("");
      setNewDate("");
      setShowScoreForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add score");
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="glass-card border-x-0 border-t-0 rounded-none">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <Trophy className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">
              GolfGives
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground mb-8">
            Welcome back, {me?.name || "Player"}
          </p>
          {error ? (
            <p className="text-sm text-destructive mb-4">{error}</p>
          ) : null}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Subscription Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">
                Subscription
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium text-accent">
                  {subscription?.status || "inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-sm font-medium text-foreground">
                  {subscription?.plan || "none"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Renewal</span>
                <span className="text-sm text-foreground">
                  {subscription?.renewal_date
                    ? new Date(subscription.renewal_date).toLocaleDateString(
                        "en-GB",
                      )
                    : "-"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Charity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-accent" />
              <h3 className="font-display font-semibold text-foreground">
                My Charity
              </h3>
            </div>
            <div className="space-y-3">
              <div className="text-foreground font-medium">{charityName}</div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Contribution
                </span>
                <span className="text-sm font-medium text-accent">
                  {me?.charity_percentage || 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Given
                </span>
                <span className="text-sm font-medium text-foreground">
                  Calculated at payout
                </span>
              </div>
            </div>
          </motion.div>

          {/* Winnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">
                Winnings
              </h3>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-display font-bold text-gradient-gold">
                ₹{totalWinnings.toFixed(2)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Draws Won</span>
                <span className="text-sm font-medium text-foreground">
                  {myWinners.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Payout Status
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Tracked in winners
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">
                My Scores
              </h3>
              <span className="text-xs text-muted-foreground">
                (Stableford)
              </span>
            </div>
            <Button
              onClick={() => setShowScoreForm(!showScoreForm)}
              size="sm"
              className="gradient-gold text-primary-foreground font-semibold hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Score
            </Button>
          </div>

          {showScoreForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="glass-card p-4 mb-4 border-primary/20"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Score (1-45)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={45}
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    placeholder="38"
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={addScore}
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Save
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Adding a new score will replace your oldest entry (only 5 scores
                kept).
              </p>
            </motion.div>
          )}

          <div className="space-y-2">
            {scores.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                    <span className="text-sm font-display font-bold text-primary-foreground">
                      {s.score}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {new Date(s.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {i === 0 ? "Latest" : `Score ${i + 1}`}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  #{s.id}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Draw Participation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shuffle className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              Draw Participation
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-1">
                Draws Entered
              </div>
              <div className="text-2xl font-display font-bold text-foreground">
                {scores.length}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-1">
                Next Draw
              </div>
              <div className="text-lg font-display font-bold text-primary">
                {latestDraw?.draw_date
                  ? new Date(latestDraw.draw_date).toLocaleDateString("en-GB")
                  : "Not available"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {latestDraw
                  ? `Numbers: ${latestDraw.num1}, ${latestDraw.num2}, ${latestDraw.num3}, ${latestDraw.num4}, ${latestDraw.num5}`
                  : "No draw numbers yet"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
