import React from "react";
import { FaBirthdayCake } from "react-icons/fa";
import { motion } from "framer-motion";

const RepetitiveEvent = ({ event }) => {
  return (
    <motion.div
      className="flex items-center p-4 bg-pink-100 dark:bg-pink-800 rounded-lg shadow mb-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FaBirthdayCake
        className="text-pink-500 dark:text-pink-300 mr-3"
        size={24}
      />
      <div>
        <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-200">
          {event.name}
        </h3>
        <p className="text-sm text-pink-600 dark:text-pink-400">
          {event.frequency}
        </p>
      </div>
    </motion.div>
  );
};

export default RepetitiveEvent;
