const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/todos", require("./routes/todoRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
    res.send("Welcome to the Todo App API!");
  });
// /home/jainil24/Documents/Code/my-app/backend/config/db.js
