import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#282c34] rounded-lg shadow-lg max-w-md p-6 text-center">
        <h2 className="text-2xl font-bold text-[#d4d4dc] mb-4">
          Confirm Delete
        </h2>
        <p className="text-[#a1a1aa] mb-6">
          Are you sure you want to delete this? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-[#a1a1aa] text-[#1b1b1e] font-medium px-4 py-2 rounded-md hover:bg-[#7e7e88] transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#e57373] text-[#1b1b1e] font-medium px-4 py-2 rounded-md hover:bg-[#d32f2f] transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
