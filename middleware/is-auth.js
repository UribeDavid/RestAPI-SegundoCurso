const jwt = require('jsonwebtoken');

const verification = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token, 'the-secret-parameter')
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}

module.exports = {
    verification
}