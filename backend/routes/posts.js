const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const Mime_Type = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let isValid = Mime_Type[file.mimetype];
        let error = new Error("Invalid File type");
        if (isValid) { error = null; }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = Mime_Type[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);

    }
});



router.get('/api/posts', (req, res) => {
    const pageSize = +req.query.pagesize;
    const currPage = +req.query.currpage;
    const getQuerry = Post.find();
    let fetchedPosts;
    if (pageSize && currPage) {
        getQuerry.skip(pageSize * (currPage - 1)).limit(pageSize);
    }

    getQuerry.then(docs => {
        fetchedPosts = docs;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: "Post fetched",
            posts: fetchedPosts,
            totalPosts: count
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});

router.get('/api/post/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).then(doc => {
        res.status(200).json({
            id: doc._id,
            title: doc.title,
            content: doc.content,
            imagePath: doc.imagePath
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});


router.post('/api/save', checkAuth, multer({ storage: storage }).single('image'), (req, res) => {
    const url = req.protocol + '://' + req.get("host");
    let post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(postAdded => {
        res.status(201).json(
            {
                message: "Post saved",
                post: {
                    id: postAdded._id,
                    title: postAdded.title,
                    content: postAdded.content,
                    imagePath: postAdded.imagePath,
                    creator: req.userData.userId
                }
            }
        );
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});

router.put('/api/update/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((res) => {
        if (res.nModified > 0)
            res.status(200).json({ message: "Updated" });
        else
            res.status(401).json({ message: "Not Allowed" });

    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
});

router.delete('/api/post/:id', checkAuth, (req, res) => {
    let id = req.params.id;
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(() => {
        if (res.n > 0)
            res.status(200).json({ message: "Deleted" });
        else
            res.status(401).json({ message: "Not Allowed" });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;