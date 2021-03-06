const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            posts: []
        });
        await user.save();
        res.status(201).json({
            message: 'User created successfully!',
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const signIn = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect!');
        error.statusCode = 422;
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error('Email does not exists!');
            error.statusCode = 404;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('The password is incorrect');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ 
            email: user.email, 
            userId: user._id.toString()  
            },
            'the-secret-parameter',
            { expiresIn: '1h' }
        );
        res.status(200).json({
            token,
            userId: user._id.toString()
        })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('User not found!');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            status: user.status
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const updateStatus = async (req, res, next) => {
    const status = req.body.status;
    try {
        const user = await User.findById(req.userId);
        user.status = status;
        await user.save();
        res.status(201).json({
            message: 'Status updated!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports = {
    signUp,
    signIn,
    getUserStatus,
    updateStatus
}