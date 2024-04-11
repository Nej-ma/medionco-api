// src/middleware/authorizeRole.js

export default function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        const { user } = req;
        if (user && (user.role === 'admin' || allowedRoles.includes(user.role))) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden - You don't have permission to access this." });
        }
    };
}
