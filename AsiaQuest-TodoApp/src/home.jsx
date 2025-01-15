import { useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3000/todo", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTodos(data.data.todos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const postData = async (title) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3000/todo", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      await response;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteData = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:3000/todo/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      await response;
    } catch (error) {
      console.log(error);
    }
  };

  const putData = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:3000/todo/${data.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: data.title, checked: data.checked, task_order: data.task_order }),
      });
      await response;
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await postData(input);
    await fetchData();
    setInput("");
  };

  const toggleComplete = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    todo.checked = !todo.checked;
    await putData(todo);
    await fetchData();
  };

  const deleteTodo = async (id) => {
    await deleteData(id);
    await fetchData();
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    todo.title = editText;
    await putData(todo);
    await fetchData();
    setEditingId(null);
  };

  const moveTask = async (index, direction) => {
    const newTodos = [...todos];
    const task = newTodos[index];
    if (direction === "up" && index > 0) {
      newTodos.splice(index, 1);
      newTodos.splice(index - 1, 0, task);
    } else if (direction === "down" && index < newTodos.length - 1) {
      newTodos.splice(index, 1);
      newTodos.splice(index + 1, 0, task);
    }
    const updatedTodos = newTodos.map((todo, i) => ({ ... todo, task_order: i + 1 }));
    await Promise.all(updatedTodos.map((todo) => putData(todo)));

    setTodos(newTodos);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate('/login');
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      <button onClick={logout} className="logout-button">Logout</button>
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add</button>
      </form>
      <div className="todo-list">
        {todos.map((todo, index) => (
          <div
            key={todo.id}
            className={`todo-item ${todo.checked ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.checked}
              onChange={() => toggleComplete(todo.id)}
            />
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(todo.id)}
                autoFocus
              />
            ) : (
              <span
                onClick={() => startEditing(todo.id, todo.title)}
                className={todo.checked ? "strikethrough" : ""}
              >
                {todo.title}
              </span>
            )}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            <div className="reorder-buttons">
              <button onClick={() => moveTask(index, "up")}>⬆️</button>
              <button onClick={() => moveTask(index, "down")}>⬇️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;