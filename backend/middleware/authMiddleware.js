const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - authenticate user
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log(`Authorization failed: User ${req.user.email} with role '${req.user.role}' tried to access route requiring roles: ${roles.join(', ')}`);
      return res.status(403).json({
        success: false,
        message: `Access denied. This route requires ${roles.join(' or ')} role. Your current role is: ${req.user.role}`,
        userRole: req.user.role,
        requiredRoles: roles
      });
    }
    next();
  };
};
