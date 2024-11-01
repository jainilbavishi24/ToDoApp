// src/components/TodoApp.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import { FaPlus, FaTrash, FaSun, FaMoon } from "react-icons/fa";
import RepetitiveEvent from "./RepetitiveEvent";
import Modal from "react-modal";
import {
  auth,
  firestore,
  signOutUser,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
} from "../firebase"; // Corrected import path and necessary exports

Modal.setAppElement("#root");

const TodoApp = () => {
  // State Variables
  const [todos, setTodos] = useState([]);
  const [repetitiveEvents, setRepetitiveEvents] = useState([]);
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Repetitive Event State Variables
  const [eventName, setEventName] = useState("");
  const [eventFrequency, setEventFrequency] = useState("Every Year");
  const [eventDate, setEventDate] = useState("");
  const [eventMonth, setEventMonth] = useState("");
  const [eventDay, setEventDay] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        fetchTodos(u.uid);
        fetchRepetitiveEvents(u.uid);
      } else {
        setTodos([]);
        setRepetitiveEvents([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTodos = async (uid) => {
    try {
      const todosRef = collection(firestore, "users", uid, "todos");
      const q = query(todosRef);
      const snapshot = await getDocs(q);
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosData);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const fetchRepetitiveEvents = async (uid) => {
    try {
      const eventsRef = collection(firestore, "users", uid, "repetitiveEvents");
      const q = query(eventsRef);
      const snapshot = await getDocs(q);
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRepetitiveEvents(eventsData);
    } catch (err) {
      console.error("Error fetching repetitive events:", err);
    }
  };

  // Function to Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Function to Add a New Todo
  const addTodo = async () => {
    if (!input.trim()) {
      setError("Please enter a todo.");
      return;
    }

    if (!deadline) {
      setError("Please set a deadline.");
      return;
    }

    const now = new Date();
    const deadlineDate = new Date(deadline);

    if (deadlineDate <= now) {
      setError("Deadline must be in the future.");
      return;
    }

    try {
      const newTodo = {
        text: input,
        deadline: deadline,
        completed: false,
        createdAt: serverTimestamp(),
      };

      const todosColRef = collection(firestore, "users", user.uid, "todos");
      await addDoc(todosColRef, newTodo);
      setInput("");
      setDeadline("");
      setError("");
      fetchTodos(user.uid);
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add todo. Please try again.");
    }
  };

  // Function to Determine Priority Class Based on Deadline
  const getPriorityClass = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDifference = deadlineDate - now;
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    if (timeDifference < oneDay) {
      return "border-red-500";
    } else if (timeDifference < 7 * oneDay) {
      return "border-yellow-500";
    } else {
      return "border-green-500";
    }
  };

  // Function to Toggle Completion Status of a Todo
  const toggleComplete = async (index) => {
    const todo = todos[index];
    try {
      const todoDocRef = doc(firestore, "users", user.uid, "todos", todo.id);
      await updateDoc(todoDocRef, {
        completed: !todo.completed,
      });
      fetchTodos(user.uid);
    } catch (err) {
      console.error("Error toggling todo completion:", err);
      setError("Failed to update todo. Please try again.");
    }
  };

  // Function to Delete a Todo
  const deleteTodo = async (index) => {
    const todo = todos[index];
    try {
      const todoDocRef = doc(firestore, "users", user.uid, "todos", todo.id);
      await deleteDoc(todoDocRef);
      fetchTodos(user.uid);
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo. Please try again.");
    }
  };

  // Function to Add a Repetitive Event
  const addRepetitiveEvent = async () => {
    if (!eventName.trim()) {
      setError("Event name cannot be empty.");
      return;
    }

    if (eventFrequency === "Every Year") {
      if (!eventDate || eventDate < 1 || eventDate > 31) {
        setError("Please enter a valid date (1-31).");
        return;
      }
      if (!eventMonth || eventMonth < 1 || eventMonth > 12) {
        setError("Please enter a valid month (1-12).");
        return;
      }
    }

    if (eventFrequency === "Every Month") {
      if (!eventDate || eventDate < 1 || eventDate > 31) {
        setError("Please enter a valid date (1-31).");
        return;
      }
    }

    if (eventFrequency === "Every Week") {
      if (!eventDay) {
        setError("Please select a day of the week.");
        return;
      }
    }

    setError("");

    let newEvent = {
      name: eventName,
      frequency: eventFrequency,
    };

    if (eventFrequency === "Every Year") {
      newEvent.date = eventDate;
      newEvent.month = eventMonth;
    } else if (eventFrequency === "Every Month") {
      newEvent.date = eventDate;
    } else if (eventFrequency === "Every Week") {
      newEvent.day = eventDay;
    }

    try {
      const eventsColRef = collection(
        firestore,
        "users",
        user.uid,
        "repetitiveEvents"
      );
      await addDoc(eventsColRef, newEvent);
      setEventName("");
      setEventFrequency("Every Year");
      setEventDate("");
      setEventMonth("");
      setEventDay("");
      setError("");
      setIsModalOpen(false);
      fetchRepetitiveEvents(user.uid);
    } catch (err) {
      console.error("Error adding repetitive event:", err);
      setError("Failed to add repetitive event. Please try again.");
    }
  };

  // Function to Check if a Date is Valid
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date);
  };

  // Function to Close Modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700 flex flex-col">
        {/* Header */}
        <header className="w-full bg-blue-600 dark:bg-blue-800 py-6 mb-10 flex justify-between items-center px-4">
          <h1 className="text-4xl font-bold text-white text-center">
            Todo App
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="text-white text-xl focus:outline-none"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button
              onClick={signOutUser}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 px-4">
          {/* Left Sidebar for Repetitive Events */}
          <aside className="w-1/4 mr-4 hidden md:block">
            {/* Repetitive Events Content */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Repetitive Events
            </h2>
            {repetitiveEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No repetitive events added.
              </p>
            ) : (
              repetitiveEvents.map((event) => (
                <RepetitiveEvent key={event.id} event={event} />
              ))
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors duration-300"
            >
              Add Repetitive Event
            </button>
          </aside>

          {/* Todo List */}
          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-500">
              {/* Add Todo Form */}
              <div className="flex flex-col mb-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
                  placeholder="Add a new todo"
                />

                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
                  placeholder="Set a deadline"
                />

                <button
                  onClick={addTodo}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-300"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 mb-4">{error}</p>}

              {/* Todos List */}
              <ul>
                {todos.map((todo, index) => (
                  <motion.li
                    key={todo.id}
                    className={`p-2 mb-2 border border-gray-300 dark:border-gray-700 rounded flex items-center justify-between ${getPriorityClass(
                      todo.deadline
                    )}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(index)}
                        className="mr-2"
                      />
                      <span
                        className={`${
                          todo.completed
                            ? "line-through"
                            : "font-medium text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isValidDate(todo.deadline) ? (
                          <>
                            {format(new Date(todo.deadline), "PPpp")} -{" "}
                            {formatDistanceToNow(new Date(todo.deadline), {
                              addSuffix: true,
                            })}
                          </>
                        ) : (
                          "Invalid Date"
                        )}
                      </span>
                      <button
                        onClick={() => deleteTodo(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-300 focus:outline-none"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </main>

          {/* Right Sidebar (Optional) */}
          <aside className="w-1/4 ml-4 hidden md:block">
            {/* Upcoming Events Content */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Upcoming Events
            </h2>
            {repetitiveEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming events.
              </p>
            ) : (
              repetitiveEvents.map((event) => (
                <RepetitiveEvent key={event.id} event={event} />
              ))
            )}
          </aside>
        </div>

        {/* Repetitive Event Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Repetitive Event"
          className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
        >
          <div className="mt-6 p-4 bg-pink-100 dark:bg-pink-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-pink-700 dark:text-pink-200 mb-2">
              Add Repetitive Event
            </h3>

            {/* Event Name Input */}
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
              placeholder="Event Name"
            />

            {/* Frequency Selection */}
            <select
              value={eventFrequency}
              onChange={(e) => setEventFrequency(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
            >
              <option>Every Year</option>
              <option>Every Month</option>
              <option>Every Week</option>
            </select>

            {/* Conditional Inputs Based on Frequency */}
            {eventFrequency === "Every Year" && (
              <>
                <input
                  type="number"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
                  placeholder="Date (1-31)"
                  min="1"
                  max="31"
                />
                <input
                  type="number"
                  value={eventMonth}
                  onChange={(e) => setEventMonth(e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
                  placeholder="Month (1-12)"
                  min="1"
                  max="12"
                />
              </>
            )}

            {eventFrequency === "Every Month" && (
              <input
                type="number"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
                placeholder="Date (1-31)"
                min="1"
                max="31"
              />
            )}

            {eventFrequency === "Every Week" && (
              <select
                value={eventDay}
                onChange={(e) => setEventDay(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={addRepetitiveEvent}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors duration-300"
              >
                Add
              </button>
            </div>
          </div>
        </Modal>

        {/* Footer */}
        <footer className="w-full bg-blue-600 dark:bg-blue-800 py-4 mt-10 text-center">
          <p className="text-white">
            &copy; 2024 Todo App. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TodoApp;
