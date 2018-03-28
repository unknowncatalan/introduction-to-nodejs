var store = require('../models/store')

module.exports = {

    getComments(req, res, next) {
        res.status(200).send(store.posts[req.params.postId].comments);
    },

    addComment(req, res, next) {
        let newComment = req.body;
        let commentId = store.posts[req.params.postId].comments.length;
        store.posts[req.params.postId].comments.push(newComment);
        res.status(201).send({postId: req.params.postId, commentId: commentId});
    },

    updateComment(req, res, next) {
        store.posts[req.params.postId].comments[req.params.commentId] = req. body;
        res.status(200).send(store.posts[req.params.postId].comments[req.params.commentId]);
    },

    removeComment(req, res, next) {
        store.posts[req.params.postId].comments.splice(req.params.commentId, 1);
        res.status(204).send();
    }
}
