const express = require('express');
const session = require('express-session');

module.exports = (app) => {
    app.use(session({
        secret: 'yoursecret',
        resave: true,
        saveUninitialized: true
    }));
    app.use('/public', express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
};