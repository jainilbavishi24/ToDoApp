// src/App.js
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import TodoApp from "./components/TodoApp"; // Updated path
import Login from "./components/Login";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return user ? <TodoApp /> : <Login />;
};

export default App;
