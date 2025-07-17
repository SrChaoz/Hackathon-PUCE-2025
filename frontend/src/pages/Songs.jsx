import React, { useState, useEffect } from 'react';
import DeleteConfirmation from '../components/DeleteConfirmation';
import SongForm from '../components/SongForm';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ genre: '', artist: '' });
  const [sort, setSort] = useState({ field: 'anio', order: 'asc' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [songToEdit, setSongToEdit] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const query = new URLSearchParams({
        search,
        genre: filter.genre,
        artist: filter.artist,
        sortField: sort.field,
        sortOrder: sort.order,
        page,
      });

      const response = await fetch(`/api/songs?${query.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setSongs(data.songs);
        setTotalPages(data.totalPages);
      } else {
        alert(data.error || 'Error al cargar canciones');
      }
    };

    fetchSongs();
  }, [search, filter, sort, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleSortChange = (field) => {
    setSort({ field, order: sort.order === 'asc' ? 'desc' : 'asc' });
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/songs/${songToDelete}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      alert('Canción eliminada exitosamente');
      setSongs(songs.filter((song) => song.id !== songToDelete));
    } else {
      alert('Error al eliminar la canción');
    }

    setShowDeleteModal(false);
  };

  const handleEdit = (song) => {
    setSongToEdit(song);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (formData) => {
    const method = songToEdit ? 'PUT' : 'POST';
    const url = songToEdit ? `/api/songs/${songToEdit.id}` : '/api/songs';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert(songToEdit ? 'Canción actualizada exitosamente' : 'Canción registrada exitosamente');
      setShowFormModal(false);
      setSongToEdit(null);
      fetchSongs();
    } else {
      alert('Error al guardar la canción');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-500 mb-4">Listado de Canciones</h1>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por título"
          value={search}
          onChange={handleSearch}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          name="genre"
          value={filter.genre}
          onChange={handleFilterChange}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Filtrar por género</option>
          <option value="Rock">Rock</option>
          <option value="Pop">Pop</option>
          <option value="Jazz">Jazz</option>
        </select>
        <input
          type="text"
          name="artist"
          placeholder="Filtrar por artista"
          value={filter.artist}
          onChange={handleFilterChange}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        onClick={() => setShowFormModal(true)}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-400 mb-4"
      >
        Registrar Canción
      </button>

      <table className="w-full text-left bg-gray-800 rounded-lg">
        <thead>
          <tr>
            <th
              className="p-2 cursor-pointer hover:text-green-500"
              onClick={() => handleSortChange('titulo')}
            >
              Título
            </th>
            <th
              className="p-2 cursor-pointer hover:text-green-500"
              onClick={() => handleSortChange('artista')}
            >
              Artista
            </th>
            <th
              className="p-2 cursor-pointer hover:text-green-500"
              onClick={() => handleSortChange('anio')}
            >
              Año
            </th>
            <th
              className="p-2 cursor-pointer hover:text-green-500"
              onClick={() => handleSortChange('duracion')}
            >
              Duración
            </th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id} className="border-t border-gray-700">
              <td className="p-2">{song.titulo}</td>
              <td className="p-2">{song.artista}</td>
              <td className="p-2">{song.anio}</td>
              <td className="p-2">{song.duracion} min</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(song)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setSongToDelete(song.id);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {showDeleteModal && (
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-4 rounded-lg">
            <SongForm
              onSubmit={handleFormSubmit}
              initialData={songToEdit || {}}
              onCancel={() => setShowFormModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Songs;
