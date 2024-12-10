// components/Modal.tsx
import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;  // Ne rien afficher si la modal n'est pas ouverte

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl">Modal Title</h2>
        <p>This is a modal content!</p>
        <button 
          onClick={onClose} 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default Modal;
