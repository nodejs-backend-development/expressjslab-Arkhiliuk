const express = require('express');

const { getComments, addComment } = require('../controllers/comments.controller');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
    res.status(500).send("Please send post ID");
});

router.get('/:postID/comments', getComments);

router.post('/:postID/comments', addComment);

module.exports = router;