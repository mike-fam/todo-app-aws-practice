const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await db.query('SELECT * FROM todos');
    res.json(todos.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Add a new todo
app.post('/todos', async (req, res) => {
  const { task } = req.body;
  try {
    const newTodo = await db.query('INSERT INTO todos (task) VALUES ($1) RETURNING *', [task]);
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
