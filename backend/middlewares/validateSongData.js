const validateSongData = (req, res, next) => {
  const { titulo, artista, album, genero, anio, duracion } = req.body;

  if (!titulo || !artista || !album) {
    return res.status(400).json({ error: 'Título, artista y álbum son obligatorios' });
  }

  if (anio && (anio < 1900 || anio > new Date().getFullYear())) {
    return res.status(400).json({ error: 'El año debe estar entre 1900 y el año actual' });
  }

  if (duracion && duracion <= 0) {
    return res.status(400).json({ error: 'La duración debe ser mayor a 0' });
  }

  next();
};

module.exports = { validateSongData };
