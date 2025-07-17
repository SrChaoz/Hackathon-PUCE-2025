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
            return res.status(400).json({ error: error.message });
        }

        res.json({ 
            success: true, 
            count: data.length,
            data 
        });
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al obtener los datos de la base de datos.' });
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
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ 
            success: true,
            message: 'Canción registrada exitosamente', 
            data 
        });
    } catch (error) {
        console.error('Error al crear la canción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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
            return res.status(404).json({ error: 'Canción no encontrada o no tienes permisos para editarla' });
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
            return res.status(400).json({ error: error.message });
        }

        res.json({ 
            success: true,
            message: 'Canción actualizada exitosamente', 
            data 
        });
    } catch (error) {
        console.error('Error al actualizar la canción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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
            return res.status(404).json({ error: 'Canción no encontrada o no tienes permisos para eliminarla' });
        }

        const { error } = await supabase
            .from('canciones')
            .delete()
            .eq('id', id)
            .eq('usuario_id', userId);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ 
            success: true,
            message: 'Canción eliminada exitosamente' 
        });
    } catch (error) {
        console.error('Error al eliminar la canción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



// Validar datos antes de insertar/actualizar
const validateSongData = (req, res, next) => {
    const { titulo, artista, album, anio, duracion } = req.body;
    const errors = [];

    // Validar campos requeridos
    if (!titulo || titulo.trim() === '') {
        errors.push('El título es requerido');
    }
    if (!artista || artista.trim() === '') {
        errors.push('El artista es requerido');
    }
    if (!album || album.trim() === '') {
        errors.push('El álbum es requerido');
    }

    // Validar año
    if (!anio) {
        errors.push('El año es requerido');
    } else {
        const currentYear = new Date().getFullYear();
        if (anio < 1900 || anio > currentYear) {
            errors.push(`El año debe estar entre 1900 y ${currentYear}`);
        }
    }

    // Validar duración
    if (!duracion) {
        errors.push('La duración es requerida');
    } else if (duracion <= 0) {
        errors.push('La duración debe ser mayor a 0');
    } else if (duracion > 9999.99) {
        errors.push('La duración es demasiado larga');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Datos inválidos',
            details: errors
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

