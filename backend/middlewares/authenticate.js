const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Verificar que existe el header de autorización
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      error: 'Autorización requerida',
      message: 'Se requiere token de autenticación en el header Authorization',
      timestamp: new Date().toISOString()
    });
  }

  // Verificar formato del token (Bearer token)
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      error: 'Formato de token inválido',
      message: 'El token debe tener formato "Bearer <token>"',
      timestamp: new Date().toISOString()
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Token no proporcionado',
      message: 'Token de autenticación no encontrado',
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Verificar que JWT_SECRET esté configurado
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado en variables de entorno');
      return res.status(500).json({ 
        success: false,
        error: 'Error de configuración del servidor',
        message: 'Configuración de autenticación no disponible',
        timestamp: new Date().toISOString()
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el token contiene la información necesaria
    if (!decoded.userId && !decoded.id) {
      return res.status(401).json({ 
        success: false,
        error: 'Token inválido',
        message: 'El token no contiene información de usuario válida',
        timestamp: new Date().toISOString()
      });
    }

    // Asegurar que req.user tenga la estructura correcta
    req.user = {
      id: decoded.userId || decoded.id,
      ...decoded
    };

    next();
  } catch (err) {
    console.error('Error de autenticación:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expirado',
        message: 'El token de autenticación ha expirado',
        timestamp: new Date().toISOString()
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token inválido',
        message: 'El token de autenticación no es válido',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(401).json({ 
      success: false,
      error: 'Error de autenticación',
      message: 'No se pudo verificar el token de autenticación',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = { authenticate };
