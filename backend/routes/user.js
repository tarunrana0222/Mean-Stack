const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');


router.post('/api/user/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const newUser = new User({
            email: req.body.email,
            password: hash
        });
        newUser.save().then((result) => {
            res.status(201).json({
                message: 'User Created',
                result: result.email
            })
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    })

});

router.post('/api/user/login', (req, res) => {
    let existingUser;
    User.findOne({ email: req.body.email }).then(user => {
        if (!user)
            return res.status(401).json({
                message: "Auth Failed, Email not found"
            });
        existingUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result)
            return res.status(401).json({
                message: "Auth Failed, Password not valid"
            });

        const token = jwt.sign({ email: existingUser.email, userId: existingUser._id }, 'hashing-string-should-be-long', { expiresIn: '1h' });
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: existingUser._id
        });
    }).catch(err => {
        res.status(401).json({
            message: "Auth Failed"
        })
    })
});


module.exports = router;