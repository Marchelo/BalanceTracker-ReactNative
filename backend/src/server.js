// const express = require("express")
import express, { json } from "express"
import dotenv from "dotenv"
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionsRoute.js"
import job from "./config/cron.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start() ;

// middleware - fja koja se odvija izmedju request-a i response-a
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;
  // provera za render
app.get("/api/health", (req, res) => {
  res.status(200).json({status:"ok"})
})

app.use("/api/transactions", transactionRoute)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});
