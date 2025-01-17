import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
  <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-auto">
    <button
      onClick={onClose}
      className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 focus:outline-none"
      aria-label="Close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div className="space-y-8">
      {children}
    </div>
  </div>
</div>

  );
};

export default Modal;
