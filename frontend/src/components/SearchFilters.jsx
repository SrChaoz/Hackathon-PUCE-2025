import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { songsAPI } from '../services/api';

const SearchFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    titulo: '',
    artista: '',
    album: '',
    genero: '',
    anio: '',
    sortBy: 'id',
    sortOrder: 'desc'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);

  // Cargar géneros y artistas disponibles
  useEffect(() => {
    const loadData = async () => {
      try {
        const [genresResponse, artistsResponse] = await Promise.all([
          songsAPI.getGenres(),
          songsAPI.getArtists()
        ]);
        
        if (genresResponse.success) {
          setGenres(genresResponse.data || []);
        }
        if (artistsResponse.success) {
          setArtists(artistsResponse.data || []);
        }
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };
    
    loadData();
  }, []);

  // Manejar cambios en filtros
  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Aplicar filtros automáticamente después de un pequeño delay
    setTimeout(() => {
      onFiltersChange(newFilters);
    }, 300);
  };

  // Limpiar filtros
  const clearFilters = () => {
    const clearedFilters = {
      titulo: '',
      artista: '',
      album: '',
      genero: '',
      anio: '',
      sortBy: 'id',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = filters.titulo || filters.artista || filters.album || filters.genero || filters.anio;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Search className="h-5 w-5 mr-2 text-gray-500" />
          Buscar y Filtrar
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtros avanzados
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors duration-200"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Búsqueda básica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título
          </label>
          <input
            type="text"
            value={filters.titulo}
            onChange={(e) => handleFilterChange('titulo', e.target.value)}
            placeholder="Buscar por título..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Artista
          </label>
          <input
            type="text"
            value={filters.artista}
            onChange={(e) => handleFilterChange('artista', e.target.value)}
            placeholder="Buscar por artista..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Álbum
          </label>
          <input
            type="text"
            value={filters.album}
            onChange={(e) => handleFilterChange('album', e.target.value)}
            placeholder="Buscar por álbum..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género
              </label>
              <select
                value={filters.genero}
                onChange={(e) => handleFilterChange('genero', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los géneros</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año
              </label>
              <input
                type="number"
                value={filters.anio}
                onChange={(e) => handleFilterChange('anio', e.target.value)}
                placeholder="Año..."
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="id">Fecha de creación</option>
                <option value="titulo">Título</option>
                <option value="artista">Artista</option>
                <option value="anio">Año</option>
                <option value="duracion">Duración</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden
              </label>
              <button
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {filters.sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          {filters.titulo && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Título: {filters.titulo}
            </span>
          )}
          {filters.artista && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Artista: {filters.artista}
            </span>
          )}
          {filters.album && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Álbum: {filters.album}
            </span>
          )}
          {filters.genero && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Género: {filters.genero}
            </span>
          )}
          {filters.anio && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Año: {filters.anio}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
