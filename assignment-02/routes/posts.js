var store = require('../models/store')

module.exports = {

    getPosts(req, res, next) {
        res.status(200).send(store.posts);
    },

    addPost(req, res, next) {
        let newPost = req.body;
        let postId = store.posts.length;
        newPost.comments = [];
        store.posts.push(newPost);
        res.status(201).send({postId: postId});
    },

    updatePost(req, res, next) {
        store.posts[req.params.postId] = req. body;
        store.posts[req.params.postId].comments = [];
        res.status(200).send(store.posts[req.params.postId]);
    },

    removePost(req, res, next) {
        store.posts.splice(req.params.postId, 1);
        res.status(204).send();
    }
}