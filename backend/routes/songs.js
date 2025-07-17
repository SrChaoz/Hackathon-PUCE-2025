const express = require('express');
const supabase = require('../utils/supabase');
const { validateSongData } = require('../middlewares/validateSongData');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

// POST /api/songs
router.post('/songs', authenticate, validateSongData, async (req, res) => {
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
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Canción registrada exitosamente', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
