import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ open, onOpenChange, title, description }) => {
  return (
    <ToastPrimitive.Provider>
      <AnimatePresence>
        {open && (
          <ToastPrimitive.Root
            className="bg-white rounded-lg shadow-lg p-4 border border-gray-200"
            asChild
            onOpenChange={onOpenChange}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <ToastPrimitive.Title className="text-sm font-medium text-gray-900">
                {title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-gray-500">
                {description}
              </ToastPrimitive.Description>
              <ToastPrimitive.Close className="absolute top-2 right-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </ToastPrimitive.Close>
            </motion.div>
          </ToastPrimitive.Root>
        )}
      </AnimatePresence>
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-96 max-w-[100vw] m-0 z-50 outline-none" />
    </ToastPrimitive.Provider>
  );
};

export default Toast; 