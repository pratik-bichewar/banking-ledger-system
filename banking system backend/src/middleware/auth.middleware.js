const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const tokenBlackListModel = require('../models/blackList.model');


async function authmiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const isTokenBlacklisted = await tokenBlackListModel.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({ message: 'Access denied. Token is blacklisted.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        req.user = user;
       return next();

    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

async function authSystemUserMiddleware(req, res, next) {

     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

     if( !token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
     }

        const isTokenBlacklisted = await tokenBlackListModel.findOne({ token });
        if (isTokenBlacklisted) {
            return res.status(401).json({ message: 'Access denied. Token is blacklisted.' });
        }

     try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('+systemUser');
        if (!user.systemUser) {
            return res.status(403).json({ message: 'Access denied. Only system users can perform this action.' });
        }
        req.user = user;
        return next();
     } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
     }
}

module.exports = {
    authmiddleware,
    authSystemUserMiddleware
}