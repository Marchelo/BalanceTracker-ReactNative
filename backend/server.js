// const express = require("express")
import express from "express"
import dotenv from "dotenv"
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

// middleware - fja koja se odvija izmedju request-a i response-a
app.use(express.json());

const PORT = process.env.PORT || 5001;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title  VARCHAR(255) NOT NULL,
      amount  DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    // max value in DECIMAL(10,2) - 99999999.99 
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}

app.post("/api/transactions", async (req, res) => {
  // title amount catrgort userID
  try {
    // destructure
    const {title, amount, category, user_id} = req.body;
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({message: "All fields are required!"});
    }

    const transaction = await sql`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES (${user_id},${title},${amount},${category})
      RETURNING *
    `
    
    console.log(transaction)
    res.status(201).json(transaction[0])

  } catch (error) {
    console.log("Error creating transaction", error);
    res.status(500).json({message: "Internal error"})
  }
})

console.log("my port:", process.env.PORT);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});
