// Middleware til at tjekke om bruger er logget ind
exports.kræverLogin = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ 
            success: false, 
            message: 'Du skal være logget ind for at få adgang' 
        });
    }
};