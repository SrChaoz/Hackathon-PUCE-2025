import React from 'react';

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold text-white mb-4">¿Estás seguro?</h2>
        <p className="text-gray-400 mb-6">Esta acción no se puede deshacer.</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
