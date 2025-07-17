const express = require('express');
const supabase = require('../utils/supabase');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Email y contraseña son requeridos',
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Buscar usuario por email en la tabla usuarios
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !usuarios) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas',
        message: 'Usuario no encontrado',
        timestamp: new Date().toISOString()
      });
    }

    // Verificar contraseña (en un entorno real debería estar hasheada)
    if (usuarios.password !== password) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas',
        message: 'Contraseña incorrecta',
        timestamp: new Date().toISOString()
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        userId: usuarios.id,
        email: usuarios.email,
        nombre: usuarios.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      success: true,
      token,
      user: {
        id: usuarios.id,
        email: usuarios.email,
        nombre: usuarios.nombre
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      message: 'Ocurrió un error durante la autenticación',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
