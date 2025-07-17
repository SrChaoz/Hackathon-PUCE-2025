import React, { useState } from 'react';

const SongForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: initialData.titulo || '',
    artista: initialData.artista || '',
    anio: initialData.anio || '',
    duracion: initialData.duracion || '',
    genero: initialData.genero || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold text-green-500 mb-4">{initialData.id ? 'Editar Canción' : 'Registrar Canción'}</h2>

      <div className="mb-4">
        <label className="block text-white mb-2">Título</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">Artista</label>
        <input
          type="text"
          name="artista"
          value={formData.artista}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">Año</label>
        <input
          type="number"
          name="anio"
          value={formData.anio}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">Duración (min)</label>
        <input
          type="number"
          name="duracion"
          value={formData.duracion}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">Género</label>
        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Seleccionar género</option>
          <option value="Rock">Rock</option>
          <option value="Pop">Pop</option>
          <option value="Jazz">Jazz</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded hover:bg-green-400"
        >
          {initialData.id ? 'Guardar Cambios' : 'Registrar'}
        </button>
      </div>
    </form>
  );
};

export default SongForm;
