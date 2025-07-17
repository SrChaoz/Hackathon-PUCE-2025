import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSong = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    artista: '',
    album: '',
    genero: '',
    anio: '',
    duracion: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Canción agregada exitosamente');
      navigate('/songs');
    } else {
      alert(data.error || 'Error al agregar canción');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Agregar Canción</h2>
        {['titulo', 'artista', 'album'].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-400 mb-2 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Seleccionar género</option>
            <option value="Rock">Rock</option>
            <option value="Pop">Pop</option>
            <option value="Jazz">Jazz</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Año</label>
          <input
            type="number"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Duración (minutos)</label>
          <input
            type="number"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            min="0.1"
            step="0.1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Agregar Canción
        </button>
      </form>
    </div>
  );
};

export default AddSong;
