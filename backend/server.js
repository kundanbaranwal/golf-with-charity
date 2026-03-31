const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || ["http://localhost:8081"],
    credentials: true,
  }),
);

app.get("/health", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    return res.json({ status: "ok", database: "connected" });
  } catch (_error) {
    return res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/subscription", require("./routes/subscriptionRoutes"));
app.use("/api/draw", require("./routes/drawRoutes"));
app.use("/api/charities", require("./routes/charityRoutes"));
app.use("/api/winners", require("./routes/winnerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection check failed:", error.message);
  }

  console.log(`Server running on port ${PORT}`);
});
