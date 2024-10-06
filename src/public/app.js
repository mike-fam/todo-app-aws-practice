document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput');
  const todoList = document.getElementById('todoList');

  // Fetch and display existing todos
  const loadTodos = async () => {
    const res = await fetch('/todos');
    const todos = await res.json();
    todoList.innerHTML = '';
    todos.forEach(todo => addTodoToList(todo));
  };

  // Add todo item to the list
  const addTodoToList = (todo) => {
    const li = document.createElement('li');
    li.classList.add('todo-item');

    const taskSpan = document.createElement('span');
    taskSpan.className = todo.completed ? 'completed' : '';
    taskSpan.textContent = todo.task;

    // Create mark as completed button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = todo.completed ? 'Undo' : 'Complete';
    completeBtn.className = todo.completed ? 'undo-btn' : 'complete-btn';

    completeBtn.addEventListener('click', async () => {
      const updatedStatus = !todo.completed;
      await toggleTodoCompletion(todo.id, updatedStatus);
      taskSpan.classList.toggle('completed', updatedStatus);
      completeBtn.textContent = updatedStatus ? 'Undo' : 'Complete';
      completeBtn.className = updatedStatus ? 'undo-btn' : 'complete-btn';
      todo.completed = updatedStatus;
    });

    li.appendChild(taskSpan);
    li.appendChild(completeBtn);
    todoList.appendChild(li);
  };

  // Handle form submission to add new todo
  todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const task = todoInput.value.trim();
    if (task) {
      const res = await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });

      const newTodo = await res.json();
      addTodoToList(newTodo);

      // Clear input
      todoInput.value = '';
    }
  });

  // Toggle todo completion status in the backend
  const toggleTodoCompletion = async (id, completed) => {
    await fetch(`/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
  };

  // Load todos on page load
  loadTodos();
});
