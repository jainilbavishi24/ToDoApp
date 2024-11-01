// src/components/Login.js
import React from "react";
import { signInWithGoogle, signInWithMicrosoft } from "../firebase";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <h2 className="text-2xl mb-4 text-gray-800 dark:text-gray-200">Login</h2>
      <button
        onClick={signInWithGoogle}
        className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
      <button
        onClick={signInWithMicrosoft}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Sign in with Microsoft
      </button>
    </div>
  );
};

export default Login;
