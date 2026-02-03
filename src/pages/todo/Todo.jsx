import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../navbar/navbar";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Todo = () => {
  const [todo, settodo] = useState("");
  const [todos, settodos] = useState([]);
  const firstRender = useRef(true);
  const navigate = useNavigate();

  const getConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return null;
    }
    return { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
  };

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      const config = getConfig();
      if (!config) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/todo/get`, config);
        settodos(res.data.todos);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Could not fetch todos");
      }
    };
    fetchTodos();
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleSave = async () => {
    const regex = /^[A-Za-z0-9\s.,!?-]{1,100}$/;
    if (!todo) return toast.error("Please enter the todo");
    if (!regex.test(todo)) return toast.error("Invalid Todo! 1-100 chars, letters, numbers, . , ! ? - only");
    if (todos.some(item => item.title.toLowerCase() === todo.trim().toLowerCase()))
      return toast.error("Todo already exists");

    const config = getConfig();
    if (!config) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/todo/save`, { title: todo }, config);
      settodo("");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/todo/get`, config);
      settodos(res.data.todos);
      toast.success("Todo added successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to delete this todo?")) return;
    const config = getConfig();
    if (!config) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/todo/delete/${id}`, config);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/todo/get`, config);
      settodos(res.data.todos);
      toast.success("Todo deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = async (id, currentTitle) => {
    settodo(currentTitle);
    const config = getConfig();
    if (!config) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/todo/delete/${id}`, config);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/todo/get`, config);
      settodos(res.data.todos);
      toast.info("Edit your todo and click Save.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleCheckbox = async (id) => {
    const index = todos.findIndex(item => item._id === id);
    if (index === -1) return;
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    settodos(newTodos);

    const config = getConfig();
    if (!config) return;

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/todo/update/${id}`, { isCompleted: newTodos[index].isCompleted }, config);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Could not update todo status");
      newTodos[index].isCompleted = !newTodos[index].isCompleted;
      settodos(newTodos);
    }
  };

  const deleteAll = async () => {
    if (todos.length === 0) return toast.error("No todos to delete");
    if (!window.confirm("Do you really want to delete all todos?")) return;

    const config = getConfig();
    if (!config) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/todo/delete-all`, config);
      settodos([]);
      toast.success("All todos deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gradient-to-b from-purple-200 via-blue-200 to-purple-100 pt-24 px-4 md:px-10">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Add a Todo</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={todo}
              onChange={(e) => settodo(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a Todo"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-2xl hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={deleteAll}
              className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition"
            >
              Delete All Todos
            </button>
          </div>

          <h3 className="text-xl font-semibold mb-4">Your Todos</h3>

          <div className="space-y-3">
            {todos.map((item) => (
              <div
                key={item._id}
                className={`flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl border ${item.isCompleted ? "bg-green-100 line-through" : "bg-gray-100"}`}
              >
                <div className="flex items-center gap-2 mb-2 md:mb-0">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => handleCheckbox(item._id)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">{item.title}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item._id, item.title)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-4 py-1 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {todos.length === 0 && <p className="text-center text-gray-500">No todos yet</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
