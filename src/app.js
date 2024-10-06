const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const updatedTodo = await db.query(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, id]
    );
    res.json(updatedTodo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await db.query('SELECT * FROM todos ORDER BY id');
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
