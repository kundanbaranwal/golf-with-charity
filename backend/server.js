const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:8081",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:8083",
        "http://localhost:8084",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8082",
        "http://127.0.0.1:8083",
        "http://127.0.0.1:8084",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
