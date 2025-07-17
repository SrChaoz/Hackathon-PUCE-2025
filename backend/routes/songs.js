const express = require('express');
const { validateSongData } = require('../middlewares/validateSongData');
const { authenticate } = require('../middlewares/authenticate');
const {
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
    validateSongData: controllerValidation
} = require('../controllers/songsController');

const router = express.Router();

// GET /api/songs - Obtener todas las canciones (con filtros opcionales)
router.get('/songs', getAllSongs);

// GET /api/songs/stats - Obtener estadísticas de canciones del usuario autenticado
router.get('/songs/stats', authenticate, getSongStats);

// GET /api/songs/genres - Obtener géneros únicos disponibles
router.get('/songs/genres', getGenres);

// GET /api/songs/artists - Obtener artistas únicos disponibles
router.get('/songs/artists', getArtists);

// GET /api/songs/years - Buscar canciones por rango de años
router.get('/songs/years', getSongsByYearRange);

// GET /api/songs/duration - Buscar canciones por duración
router.get('/songs/duration', getSongsByDuration);

// GET /api/songs/user/:userId - Obtener canciones por usuario
router.get('/songs/user/:userId', getSongsByUser);

// GET /api/songs/:id - Obtener una canción por ID
router.get('/songs/:id', getSongById);

// POST /api/songs - Crear una nueva canción
router.post('/songs', authenticate, controllerValidation, createSong);

// PUT /api/songs/:id - Actualizar una canción
router.put('/songs/:id', authenticate, controllerValidation, updateSong);

// DELETE /api/songs/:id - Eliminar una canción
router.delete('/songs/:id', authenticate, deleteSong);

module.exports = router;
