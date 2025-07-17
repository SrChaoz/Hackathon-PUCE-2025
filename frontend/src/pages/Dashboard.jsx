import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { songsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import SongTable from '../components/SongTable';
import SongForm from '../components/SongForm';
import SearchFilters from '../components/SearchFilters';
import StatsCard from '../components/StatsCard';
import { Plus, Music, TrendingUp, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  // Cargar canciones
  const loadSongs = async (newFilters = {}) => {
    try {
      setLoading(true);
      const response = await songsAPI.getAll({
        ...filters,
        ...newFilters
      });
      
      if (response.success) {
        setSongs(response.data || []);
        // Simular paginación en frontend ya que el backend no la implementa aún
        setPagination(prev => ({
          ...prev,
          total: response.count || response.data?.length || 0
        }));
      }
    } catch (error) {
      console.error('Error loading songs:', error);
      toast.error('Error al cargar las canciones');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      const response = await songsAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadSongs();
    loadStats();
  }, []);

  // Manejar cambios en filtros
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    loadSongs(newFilters);
  };

  // Manejar creación/edición de canción
  const handleSongSubmit = async (songData) => {
    try {
      let response;
      if (editingSong) {
        response = await songsAPI.update(editingSong.id, songData);
        toast.success('Canción actualizada exitosamente');
      } else {
        response = await songsAPI.create(songData);
        toast.success('Canción creada exitosamente');
      }
      
      setShowForm(false);
      setEditingSong(null);
      loadSongs();
      loadStats();
    } catch (error) {
      console.error('Error saving song:', error);
      const message = error.response?.data?.message || 'Error al guardar la canción';
      toast.error(message);
    }
  };

  // Manejar eliminación de canción
  const handleDeleteSong = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta canción?')) {
      return;
    }

    try {
      await songsAPI.delete(id);
      toast.success('Canción eliminada exitosamente');
      loadSongs();
      loadStats();
    } catch (error) {
      console.error('Error deleting song:', error);
      const message = error.response?.data?.message || 'Error al eliminar la canción';
      toast.error(message);
    }
  };

  // Manejar edición de canción
  const handleEditSong = (song) => {
    setEditingSong(song);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola, {user?.name || 'Usuario'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona tu biblioteca musical
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSong(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Canción
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="px-4 py-4 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total de Canciones"
                value={stats.totalSongs || 0}
                icon={Music}
                color="blue"
              />
              <StatsCard
                title="Géneros"
                value={Object.keys(stats.byGenre || {}).length}
                icon={TrendingUp}
                color="green"
              />
              <StatsCard
                title="Artistas"
                value={Object.keys(stats.byYear || {}).length}
                icon={Users}
                color="purple"
              />
              <StatsCard
                title="Años Cubiertos"
                value={Object.keys(stats.byYear || {}).length}
                icon={Clock}
                color="orange"
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="px-4 py-4 sm:px-0">
          <SearchFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* Songs Table */}
        <div className="px-4 sm:px-0">
          <SongTable
            songs={songs}
            loading={loading}
            onEdit={handleEditSong}
            onDelete={handleDeleteSong}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          />
        </div>
      </div>

      {/* Song Form Modal */}
      {showForm && (
        <SongForm
          song={editingSong}
          onSubmit={handleSongSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingSong(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
