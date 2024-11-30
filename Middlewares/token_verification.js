exports.authenticateToken = (req, res, next)=> {
    const token = req.header('Authorization')?.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: 'Access token required' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Expired token' });
        req.user = user;
        next();
    });
}
