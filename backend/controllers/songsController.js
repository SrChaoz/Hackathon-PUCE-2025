const supabase = require('../utils/supabase');

// Obtener todas las canciones o filtrar por parámetros
const getAllSongs = async (req, res) => {
    const { titulo, artista, album, genero, anio, usuario_id } = req.query;

    try {
        let query = supabase
            .from('canciones')
            .select('*');

        // Aplicar filtros si se proporcionan
        if (titulo) {
            query = query.ilike('titulo', `%${titulo}%`);
        }
        if (artista) {
            query = query.ilike('artista', `%${artista}%`);
        }
        if (album) {
            query = query.ilike('album', `%${album}%`);
        }
        if (genero) {
            query = query.ilike('genero', `%${genero}%`);
        }
        if (anio) {
            query = query.eq('anio', anio);
        }
        if (usuario_id) {
            query = query.eq('usuario_id', usuario_id);
        }

        // Ordenar por ID (más recientes primero)
        query = query.order('id', { ascending: false });

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({ 
                success: false,
                error: 'Error en la consulta de base de datos',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }

        res.json({ 
            success: true, 
            count: data.length,
            data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'Error al obtener los datos de la base de datos',
            timestamp: new Date().toISOString()
        });
    }
};

// Crear una nueva canción
const createSong = async (req, res) => {
    const { titulo, artista, album, genero, anio, duracion } = req.body;
    const userId = req.user.id; // Obtenido del middleware de autenticación

    try {
        const { data, error } = await supabase
            .from('canciones')
            .insert({
                titulo,
                artista,
                album,
                genero,
                anio,
                duracion,
                usuario_id: userId,
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({ 
                success: false,
                error: 'Error al crear la canción',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }

        res.status(201).json({ 
            success: true,
            message: 'Canción registrada exitosamente', 
            data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al crear la canción:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'No se pudo crear la canción',
            timestamp: new Date().toISOString()
        });
    }
};

// Actualizar una canción
const updateSong = async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, album, genero, anio, duracion } = req.body;
    const userId = req.user.id;

    try {
        // Verificar si la canción existe y pertenece al usuario
        const { data: existingSong, error: findError } = await supabase
            .from('canciones')
            .select('*')
            .eq('id', id)
            .eq('usuario_id', userId)
            .single();

        if (findError || !existingSong) {
            return res.status(404).json({ 
                success: false,
                error: 'Recurso no encontrado',
                message: 'Canción no encontrada o no tienes permisos para editarla',
                timestamp: new Date().toISOString()
            });
        }

        const { data, error } = await supabase
            .from('canciones')
            .update({
                titulo,
                artista,
                album,
                genero,
                anio,
                duracion
            })
            .eq('id', id)
            .eq('usuario_id', userId)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ 
                success: false,
                error: 'Error al actualizar la canción',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }

        res.json({ 
            success: true,
            message: 'Canción actualizada exitosamente', 
            data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al actualizar la canción:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'No se pudo actualizar la canción',
            timestamp: new Date().toISOString()
        });
    }
};

// Eliminar una canción
const deleteSong = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Verificar si la canción existe y pertenece al usuario
        const { data: existingSong, error: findError } = await supabase
            .from('canciones')
            .select('*')
            .eq('id', id)
            .eq('usuario_id', userId)
            .single();

        if (findError || !existingSong) {
            return res.status(404).json({ 
                success: false,
                error: 'Recurso no encontrado',
                message: 'Canción no encontrada o no tienes permisos para eliminarla',
                timestamp: new Date().toISOString()
            });
        }

        const { error } = await supabase
            .from('canciones')
            .delete()
            .eq('id', id)
            .eq('usuario_id', userId);

        if (error) {
            return res.status(400).json({ 
                success: false,
                error: 'Error al eliminar la canción',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }

        res.json({ 
            success: true,
            message: 'Canción eliminada exitosamente',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al eliminar la canción:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'No se pudo eliminar la canción',
            timestamp: new Date().toISOString()
        });
    }
};

// Obtener una canción por ID
const getSongById = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('canciones')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({ 
                success: false,
                error: 'Canción no encontrada',
                message: 'No se encontró una canción con el ID proporcionado',
                timestamp: new Date().toISOString()
            });
        }

        res.json({ 
            success: true, 
            data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'Error al obtener la canción',
            timestamp: new Date().toISOString()
        });
    }
};

// Obtener canciones por usuario
const getSongsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const { data, error } = await supabase
            .from('canciones')
            .select('*')
            .eq('usuario_id', userId)
            .order('id', { ascending: false });

        if (error) {
            return res.status(400).json({ 
                success: false,
                error: 'Error en la consulta de base de datos',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }

        res.json({ 
            success: true, 
            count: data.length,
            data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'Error al obtener las canciones del usuario',
            timestamp: new Date().toISOString()
        });
    }
};

// Obtener estadísticas de canciones
const getSongStats = async (req, res) => {
    const userId = req.user.id;

    try {
        // Total de canciones del usuario
        const { count: totalSongs, error: countError } = await supabase
            .from('canciones')
            .select('*', { count: 'exact', head: true })
            .eq('usuario_id', userId);

        if (countError) {
            return res.status(400).json({ 
                success: false,
                error: 'Error al obtener estadísticas',
                message: countError.message,
                timestamp: new Date().toISOString()
            });
        }

        // Canciones por género
        const { data: genreStats, error: genreError } = await supabase
            .from('canciones')
            .select('genero')
            .eq('usuario_id', userId);

        if (genreError) {
            return res.status(400).json({ 
                success: false,
                error: 'Error al obtener estadísticas por género',
                message: genreError.message,
                timestamp: new Date().toISOString()
            });
        }

        // Contar canciones por género
        const genreCounts = genreStats.reduce((acc, song) => {
            const genre = song.genero || 'Sin género';
            acc[genre] = (acc[genre] || 0) + 1;
            return acc;
        }, {});

        // Canciones por año
        const { data: yearStats, error: yearError } = await supabase
            .from('canciones')
            .select('anio')
            .eq('usuario_id', userId);

        if (yearError) {
            return res.status(400).json({ 
                success: false,
                error: 'Error al obtener estadísticas por año',
                message: yearError.message,
                timestamp: new Date().toISOString()
            });
        }

        // Contar canciones por año
        const yearCounts = yearStats.reduce((acc, song) => {
            acc[song.anio] = (acc[song.anio] || 0) + 1;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                totalSongs: totalSongs || 0,
                byGenre: genreCounts,
                byYear: yearCounts
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'Error al obtener estadísticas',
            timestamp: new Date().toISOString()
        });
    }
};

// Buscar canciones por rango de años
const getSongsByYearRange = async (req, res) => {
    const { startYear, endYear } = req.query;

    try {
        let query = supabase
            .from('canciones')
            .select('*');

        if (startYear) {
            const start = parseInt(startYear);
            if (isNaN(start) || start < 1900) {
                return res.status(400).json({
                    success: false,
                    error: 'Año inicial inválido',
                    message: 'El año inicial debe ser un número mayor o igual a 1900',
                    timestamp: new Date().toISOString()
                });
            }
            query = query.gte('anio', start);
        }
        
        if (endYear) {
            const end = parseInt(endYear);
            if (isNaN(end) || end > new Date().getFullYear()) {
                return res.status(400).json({
                    success: false,
                    error: 'Año final inválido',
                    message: `El año final debe ser un número menor o igual al año actual (${new Date().getFullYear()})`,
                    timestamp: new Date().toISOString()
                });
            }
            query = query.lte('anio', end);
        }

        query = query.order('anio', { ascending: false });

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({ 
                success: false,
                error: 'Error en la consulta de base de datos',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            count: data.length,
            data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al buscar canciones por rango de años:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'Error al buscar canciones por rango de años',
            timestamp: new Date().toISOString()
        });
    }
};

// Buscar canciones por duración
const getSongsByDuration = async (req, res) => {
    const { minDuration, maxDuration } = req.query;

    try {
        let query = supabase
            .from('canciones')
            .select('*');

        if (minDuration) {
            const min = parseFloat(minDuration);
            if (isNaN(min) || min < 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Duración mínima inválida',
                    message: 'La duración mínima debe ser un número mayor o igual a 0',
                    timestamp: new Date().toISOString()
                });
            }
            query = query.gte('duracion', min);
        }
        
        if (maxDuration) {
            const max = parseFloat(maxDuration);
            if (isNaN(max) || max <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Duración máxima inválida',
                    message: 'La duración máxima debe ser un número mayor a 0',
                    timestamp: new Date().toISOString()
                });
            }
            query = query.lte('duracion', max);
        }

        query = query.order('duracion', { ascending: true });

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({ 
                success: false,
                error: 'Error en la consulta de base de datos',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            count: data.length,
            data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al buscar canciones por duración:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'Error al buscar canciones por duración',
            timestamp: new Date().toISOString()
        });
    }
};

// Obtener géneros únicos disponibles
const getGenres = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('canciones')
            .select('genero')
            .not('genero', 'is', null);

        if (error) {
            return res.status(400).json({ 
                success: false,
                error: 'Error en la consulta de base de datos',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }

        // Obtener géneros únicos
        const uniqueGenres = [...new Set(data.map(song => song.genero))].filter(Boolean);

        res.json({
            success: true,
            count: uniqueGenres.length,
            data: uniqueGenres.sort(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al obtener géneros:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'Error al obtener géneros',
            timestamp: new Date().toISOString()
        });
    }
};

// Obtener artistas únicos
const getArtists = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('canciones')
            .select('artista');

        if (error) {
            return res.status(400).json({ 
                success: false,
                error: 'Error en la consulta de base de datos',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }

        // Obtener artistas únicos
        const uniqueArtists = [...new Set(data.map(song => song.artista))];

        res.json({
            success: true,
            count: uniqueArtists.length,
            data: uniqueArtists.sort(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al obtener artistas:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'Error al obtener artistas',
            timestamp: new Date().toISOString()
        });
    }
};

// Validar datos antes de insertar/actualizar (versión mejorada)
const validateSongData = (req, res, next) => {
    const { titulo, artista, album, anio, duracion } = req.body;
    const errors = [];

    // Validar campos requeridos
    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        errors.push('El título es requerido y debe ser una cadena de texto válida');
    }
    if (!artista || typeof artista !== 'string' || artista.trim() === '') {
        errors.push('El artista es requerido y debe ser una cadena de texto válida');
    }
    if (!album || typeof album !== 'string' || album.trim() === '') {
        errors.push('El álbum es requerido y debe ser una cadena de texto válida');
    }

    // Validar género (opcional pero si se proporciona debe ser válido)
    const { genero } = req.body;
    if (genero && (typeof genero !== 'string' || genero.trim() === '')) {
        errors.push('El género debe ser una cadena de texto válida si se proporciona');
    }

    // Validar año (requerido, entre 1900 y año actual)
    if (!anio) {
        errors.push('El año es requerido');
    } else if (!Number.isInteger(anio) || anio < 1900 || anio > new Date().getFullYear()) {
        errors.push(`El año debe ser un número entero entre 1900 y ${new Date().getFullYear()}`);
    }

    // Validar duración (requerida, mayor a 0, formato decimal válido)
    if (duracion === undefined || duracion === null) {
        errors.push('La duración es requerida');
    } else {
        const durationNum = parseFloat(duracion);
        if (isNaN(durationNum) || durationNum <= 0) {
            errors.push('La duración debe ser un número mayor a 0');
        } else if (durationNum > 9999.99) {
            errors.push('La duración no puede exceder 9999.99 minutos');
        } else if (!/^\d+(\.\d{1,2})?$/.test(duracion.toString())) {
            errors.push('La duración debe tener máximo 2 decimales');
        }
    }

    // Validar longitud de campos de texto
    if (titulo && titulo.length > 255) {
        errors.push('El título no puede exceder 255 caracteres');
    }
    if (artista && artista.length > 255) {
        errors.push('El artista no puede exceder 255 caracteres');
    }
    if (album && album.length > 255) {
        errors.push('El álbum no puede exceder 255 caracteres');
    }
    if (genero && genero.length > 100) {
        errors.push('El género no puede exceder 100 caracteres');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Datos inválidos',
            details: errors,
            timestamp: new Date().toISOString()
        });
    }

    next();
};

module.exports = {
    getAllSongs,
    getSongById,
    getSongsByUser,
    createSong,
    updateSong,
    deleteSong,
    getSongStats,
    getSongsByYearRange,
    getSongsByDuration,
    getGenres,
    getArtists,
    validateSongData
};

