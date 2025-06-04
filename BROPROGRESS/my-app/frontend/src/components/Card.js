import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-md bg-indigo-500 text-white mb-4">
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </motion.div>
  );
};

export default Card; 