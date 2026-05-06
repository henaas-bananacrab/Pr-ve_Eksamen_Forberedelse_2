const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({success: false, message: 'Access token is missing'});
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({success: false, message: 'Invalid access token'});
        }
        req.user = user;
        next();
    });
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({success: false, message: 'Forbidden: insufficient permissions'});
        }

        const userRole = req.user.role || req.user.role_id || req.user.roleName;
        const roleString = typeof userRole === 'number' ? String(userRole) : userRole;
        const allowed = allowedRoles.map(String);

        if (!allowed.includes(roleString)) {
            return res.status(403).json({success: false, message: 'Forbidden: insufficient permissions'});
        }
        next();
    };
}

module.exports = {
    authenticateToken,
    authorizeRoles
};