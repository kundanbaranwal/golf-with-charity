import { useMemo, useState } from "react";
import { Ban, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  is_admin: number;
  is_blocked: number;
  charity_percentage: number;
  subscription_plan: "monthly" | "yearly" | null;
  subscription_status: "active" | "inactive" | null;
};

type Props = {
  users: AdminUserRow[];
  onBlockToggle: (userId: number, blocked: boolean) => Promise<void>;
  onSubscriptionUpdate: (
    userId: number,
    payload: { status: "active" | "inactive"; plan: "monthly" | "yearly" },
  ) => Promise<void>;
};

const UserAccessControl = ({
  users,
  onBlockToggle,
  onSubscriptionUpdate,
}: Props) => {
  const [query, setQuery] = useState("");
  const [busyUserId, setBusyUserId] = useState<number | null>(null);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(query.toLowerCase()) ||
          u.email?.toLowerCase().includes(query.toLowerCase()),
      ),
    [users, query],
  );

  const handleBlockToggle = async (userId: number, blocked: boolean) => {
    setBusyUserId(userId);
    try {
      await onBlockToggle(userId, blocked);
    } finally {
      setBusyUserId(null);
    }
  };

  const handleSubscriptionToggle = async (
    userId: number,
    nextStatus: "active" | "inactive",
    plan: "monthly" | "yearly",
  ) => {
    setBusyUserId(userId);
    try {
      await onSubscriptionUpdate(userId, { status: nextStatus, plan });
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <Input
          placeholder="Search users by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-secondary border-border text-foreground"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                  User
                </th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                  Subscription
                </th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                  Blocked
                </th>
                <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isBusy = busyUserId === user.id;
                const blocked = Boolean(user.is_blocked);
                const plan = user.subscription_plan || "monthly";
                const status = user.subscription_status || "inactive";

                return (
                  <tr
                    key={user.id}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-sm text-foreground">
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${user.is_admin ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      {plan} · {status}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${blocked ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}
                      >
                        {blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() =>
                            handleSubscriptionToggle(
                              user.id,
                              status === "active" ? "inactive" : "active",
                              plan,
                            )
                          }
                          className="border-border"
                        >
                          <ShieldCheck className="w-4 h-4 mr-1" />
                          {status === "active"
                            ? "Deactivate Sub"
                            : "Activate Sub"}
                        </Button>
                        {!user.is_admin ? (
                          <Button
                            size="sm"
                            variant={blocked ? "default" : "destructive"}
                            disabled={isBusy}
                            onClick={() => handleBlockToggle(user.id, !blocked)}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            {blocked ? "Unblock" : "Block"}
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAccessControl;
