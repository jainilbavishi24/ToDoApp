const express = require("express");
const Todo = require("../models/todoModel");
const router = express.Router();

// Get all Todos
router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add a new Todo
router.post("/", async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
  });
  await newTodo.save();
  res.json(newTodo);
});

// Delete a Todo
router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

module.exports = router;
