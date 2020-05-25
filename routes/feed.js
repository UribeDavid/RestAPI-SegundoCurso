const express = require('express');
const { body } = require('express-validator');

router = express.Router();

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

// GET /feed/posts
router.get('/posts', isAuth.verification, feedController.getPosts);

router.post('/post/', isAuth.verification,
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 })
    ], 
    feedController.createPost
);

router.get('/post/:postId', isAuth.verification, feedController.getPostById);

router.put('/post/:postId', isAuth.verification,
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 })
    ], 
    feedController.updatePost
);

router.delete('/post/:postId', isAuth.verification, feedController.deletePost);

module.exports = router;