import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Users,
  Shuffle,
  Heart,
  Award,
  Search,
  Play,
  Check,
  LogOut,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { clearSession, getStoredUser } from "@/lib/auth";
import UserAccessControl from "@/components/admin/UserAccessControl";

type PendingWinner = {
  id: number;
  user_name: string;
  email: string;
  match_type: number;
  prize_amount: number | null;
  status: "pending" | "paid";
};

type Charity = {
  id: number;
  name: string;
  description: string;
};

type AdminUser = {
  id: number;
  name: string;
  email: string;
  is_admin: number;
  is_blocked: number;
  charity_percentage: number;
  subscription_plan: "monthly" | "yearly" | null;
  subscription_status: "active" | "inactive" | null;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingWinners, setPendingWinners] = useState<PendingWinner[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newCharityName, setNewCharityName] = useState("");
  const [newCharityDescription, setNewCharityDescription] = useState("");
  const [latestDrawNumbers, setLatestDrawNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredWinners = useMemo(
    () =>
      pendingWinners.filter(
        (w) =>
          w.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [pendingWinners, searchTerm],
  );

  const loadAdminData = async () => {
    const [winnersData, charitiesData, latestDrawData, usersData] =
      await Promise.all([
        api.getPendingWinners(),
        api.getCharities(),
        api.getLatestDraw().catch(() => null),
        api.adminGetUsers(),
      ]);

    setPendingWinners(winnersData || []);
    setCharities(charitiesData || []);
    setUsers(usersData || []);
    if (latestDrawData) {
      setLatestDrawNumbers([
        latestDrawData.num1,
        latestDrawData.num2,
        latestDrawData.num3,
        latestDrawData.num4,
        latestDrawData.num5,
      ]);
    }
  };

  useEffect(() => {
    const boot = async () => {
      const user = getStoredUser();
      if (!user) {
        navigate("/login");
        return;
      }

      if (!user.isAdmin) {
        navigate("/dashboard");
        return;
      }

      try {
        setError("");
        await loadAdminData();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load admin data",
        );
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, [navigate]);

  const runDraw = async () => {
    try {
      setError("");
      const result = await api.runDraw();
      setLatestDrawNumbers(result.numbers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run draw");
    }
  };

  const markWinnerPaid = async (
    winnerId: number,
    prizeAmount: number | null,
  ) => {
    try {
      await api.updateWinnerStatus(winnerId, {
        status: "paid",
        prize_amount: prizeAmount || 0,
      });
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update winner");
    }
  };

  const addCharity = async () => {
    if (!newCharityName.trim()) return;
    try {
      await api.addCharity({
        name: newCharityName.trim(),
        description: newCharityDescription.trim(),
      });
      setNewCharityName("");
      setNewCharityDescription("");
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add charity");
    }
  };

  const setUserBlocked = async (userId: number, blocked: boolean) => {
    try {
      setError("");
      await api.adminSetUserBlocked(userId, blocked);
      await loadAdminData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update block status",
      );
    }
  };

  const setUserSubscription = async (
    userId: number,
    payload: { status: "active" | "inactive"; plan: "monthly" | "yearly" },
  ) => {
    try {
      setError("");
      await api.adminSetUserSubscription(userId, payload);
      await loadAdminData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update subscription status",
      );
    }
  };

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading admin dashboard...
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
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary ml-2">
              Admin
            </span>
          </Link>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">
            Admin Dashboard
          </h1>
          {error ? (
            <p className="text-sm text-destructive mb-4">{error}</p>
          ) : null}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Users,
              label: "Pending Winners",
              value: String(pendingWinners.length),
              color: "text-primary",
            },
            {
              icon: DollarSign,
              label: "Current Charities",
              value: String(charities.length),
              color: "text-primary",
            },
            {
              icon: Heart,
              label: "Latest Draw Numbers",
              value: String(latestDrawNumbers.length),
              color: "text-accent",
            },
            {
              icon: TrendingUp,
              label: "System Status",
              value: "Live",
              color: "text-accent",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="draws"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Draws
            </TabsTrigger>
            <TabsTrigger
              value="charities"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Heart className="w-4 h-4 mr-2" />
              Charities
            </TabsTrigger>
            <TabsTrigger
              value="winners"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Award className="w-4 h-4 mr-2" />
              Winners
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserAccessControl
              users={users}
              onBlockToggle={setUserBlocked}
              onSubscriptionUpdate={setUserSubscription}
            />
          </TabsContent>

          {/* Draws Tab */}
          <TabsContent value="draws" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Draw Configuration
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={runDraw}
                      className="gradient-gold text-primary-foreground font-semibold flex-1 hover:opacity-90"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run Draw
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Latest numbers:{" "}
                    {latestDrawNumbers.length > 0
                      ? latestDrawNumbers.join(", ")
                      : "No draw generated yet"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Charities Tab */}
          <TabsContent value="charities" className="space-y-4">
            <div className="glass-card p-4 space-y-3">
              <Input
                placeholder="Charity name"
                value={newCharityName}
                onChange={(e) => setNewCharityName(e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
              <Input
                placeholder="Description"
                value={newCharityDescription}
                onChange={(e) => setNewCharityDescription(e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
              <Button
                onClick={addCharity}
                className="gradient-emerald text-accent-foreground font-semibold hover:opacity-90"
              >
                + Add Charity
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {charities.map((c) => (
                <div
                  key={c.id}
                  className="glass-card p-6 flex items-center justify-between"
                >
                  <div>
                    <div className="font-display font-semibold text-foreground">
                      {c.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {c.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Winners Tab */}
          <TabsContent value="winners">
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search winner by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-border text-foreground"
                />
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Winner
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Match
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Prize
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWinners.map((w) => (
                      <tr
                        key={w.id}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="p-4 text-sm font-medium text-foreground">
                          {w.user_name}
                        </td>
                        <td className="p-4 text-sm text-foreground">
                          {w.match_type}-Number
                        </td>
                        <td className="p-4 text-sm font-display font-bold text-primary">
                          ₹{Number(w.prize_amount || 0).toFixed(2)}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {w.email}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              w.status === "paid"
                                ? "bg-accent/10 text-accent"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {w.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            {w.status === "pending" ? (
                              <Button
                                size="sm"
                                onClick={() =>
                                  markWinnerPaid(w.id, w.prize_amount)
                                }
                                className="gradient-gold text-primary-foreground text-xs hover:opacity-90"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Mark Paid
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
