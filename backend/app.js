const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/posts');
const users = require('./routes/user');

const path = require('path');


const app = express();
mongoose.connect('mongodb+srv://admin:admin@cluster0.pywuq.mongodb.net/meandb?retryWrites=true&w=majority').then(() => {
    console.log("Connected to DB");
}).catch(() => {
    console.log("DB connection failed");
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('', (req, res) => {
    res.send("test");
});
app.use('/images', express.static(path.join('backend/images')));
app.use(routes);
app.use(users);



module.exports = app;