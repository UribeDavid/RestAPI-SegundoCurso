const express = require('express');

const { body } = require('express-validator');

const authController = require('../controllers/auth');

const isAuth = require('../middleware/is-auth');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', 
    [
        body('name').trim().isLength({ min: 3 }),
        body('email').trim().isEmail().normalizeEmail()
                            .custom((value, { req } ) => {
                                return User.findOne({ email: value })
                                           .then( user => {
                                                if (user) {
                                                    return Promise.reject('Email already exists!');
                                                }
                                           });
        }),
        body('password').trim().isLength({ min: 6 })
    ],
    authController.signUp
);

router.post('/signin', authController.signIn);

router.get('/status', isAuth.verification, authController.getUserStatus);

router.put('/status', isAuth.verification, 
    [
        body('status').trim().not().isEmpty()
    ], 
    authController.updateStatus
);

module.exports = router;