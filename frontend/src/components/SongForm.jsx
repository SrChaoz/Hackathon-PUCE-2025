import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Music, User, Album, Tag, Calendar, Clock } from 'lucide-react';

const SongForm = ({ song, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      titulo: '',
      artista: '',
      album: '',
      genero: '',
      anio: new Date().getFullYear(),
      duracion: ''
    }
  });

  // Llenar el formulario si estamos editando
  useEffect(() => {
    if (song) {
      reset({
        titulo: song.titulo || '',
        artista: song.artista || '',
        album: song.album || '',
        genero: song.genero || '',
        anio: song.anio || new Date().getFullYear(),
        duracion: song.duracion || ''
      });
    }
  }, [song, reset]);

  const handleFormSubmit = async (data) => {
    // Convertir duración a número decimal
    const formattedData = {
      ...data,
      anio: parseInt(data.anio),
      duracion: parseFloat(data.duracion)
    };
    
    await onSubmit(formattedData);
  };

  // Géneros predefinidos
  const genres = [
    'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Hip Hop', 'R&B', 'Soul',
    'Funk', 'Reggae', 'Electronic', 'Dance', 'House', 'Techno', 'Ambient',
    'Classical', 'Folk', 'Alternative', 'Indie', 'Punk', 'Metal', 'Gospel',
    'Latin', 'Salsa', 'Bachata', 'Reggaeton', 'Cumbia', 'Tango'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Music className="h-6 w-6 mr-2 text-blue-600" />
            {song ? 'Editar Canción' : 'Nueva Canción'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Music className="h-4 w-4 inline mr-1" />
              Título *
            </label>
            <input
              {...register('titulo', {
                required: 'El título es requerido',
                maxLength: {
                  value: 255,
                  message: 'El título no puede exceder 255 caracteres'
                }
              })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre de la canción"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
            )}
          </div>

          {/* Artista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Artista *
            </label>
            <input
              {...register('artista', {
                required: 'El artista es requerido',
                maxLength: {
                  value: 255,
                  message: 'El artista no puede exceder 255 caracteres'
                }
              })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del artista"
            />
            {errors.artista && (
              <p className="mt-1 text-sm text-red-600">{errors.artista.message}</p>
            )}
          </div>

          {/* Álbum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Album className="h-4 w-4 inline mr-1" />
              Álbum *
            </label>
            <input
              {...register('album', {
                required: 'El álbum es requerido',
                maxLength: {
                  value: 255,
                  message: 'El álbum no puede exceder 255 caracteres'
                }
              })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del álbum"
            />
            {errors.album && (
              <p className="mt-1 text-sm text-red-600">{errors.album.message}</p>
            )}
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4 inline mr-1" />
              Género
            </label>
            <select
              {...register('genero', {
                maxLength: {
                  value: 100,
                  message: 'El género no puede exceder 100 caracteres'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar género</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            {errors.genero && (
              <p className="mt-1 text-sm text-red-600">{errors.genero.message}</p>
            )}
          </div>

          {/* Año y Duración en la misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Año */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Año *
              </label>
              <input
                {...register('anio', {
                  required: 'El año es requerido',
                  min: {
                    value: 1900,
                    message: 'El año debe ser mayor a 1900'
                  },
                  max: {
                    value: new Date().getFullYear(),
                    message: `El año no puede ser mayor a ${new Date().getFullYear()}`
                  }
                })}
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="2024"
              />
              {errors.anio && (
                <p className="mt-1 text-sm text-red-600">{errors.anio.message}</p>
              )}
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Duración (minutos) *
              </label>
              <input
                {...register('duracion', {
                  required: 'La duración es requerida',
                  min: {
                    value: 0.01,
                    message: 'La duración debe ser mayor a 0'
                  },
                  max: {
                    value: 9999.99,
                    message: 'La duración no puede exceder 9999.99 minutos'
                  },
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'La duración debe tener máximo 2 decimales'
                  }
                })}
                type="number"
                step="0.01"
                min="0.01"
                max="9999.99"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="3.45"
              />
              {errors.duracion && (
                <p className="mt-1 text-sm text-red-600">{errors.duracion.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Ejemplo: 3.45 para 3 minutos y 45 segundos
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                song ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongForm;
