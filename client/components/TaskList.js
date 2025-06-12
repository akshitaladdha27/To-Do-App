import React, { useEffect, useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/task')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await fetch('http://localhost:5000/api/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask }),
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    setNewTask('');
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/task/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(task => task._id !== id));
  };

  const toggleComplete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/task/${id}/complete`, {
      method: 'PATCH',
    });
    const updatedTask = await res.json();
    setTasks(tasks.map(t => (t._id === id ? updatedTask : t)));
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditingText(task.title);
  };

  const saveEdit = async (id) => {
    const res = await fetch(`http://localhost:5000/api/task/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editingText }),
    });
    const updatedTask = await res.json();
    setTasks(tasks.map(t => (t._id === id ? updatedTask : t)));
    setEditingId(null);
    setEditingText('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📝 My To-Do List</h2>
      <input
        type="text"
        placeholder="Enter new task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {editingId === task._id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => saveEdit(task._id)}>💾 Save</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleComplete(task._id)}
                >
                  {task.title}
                </span>
                <button onClick={() => startEditing(task)}>✏️ Edit</button>
              </>
            )}
            <button onClick={() => deleteTask(task._id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
