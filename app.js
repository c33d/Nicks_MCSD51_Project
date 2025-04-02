const express = require('express');
const app = express();

const setupMiddleware = require('./middleware');
const authRoutes = require('./routes/auth');
const galleryRoutes = require('./routes/gallery');
const conn = require('./dbConfig');
const generateDatabase = require('./generateDatabase');

app.set('view engine', 'ejs');

// Generate database.json on server startup
generateDatabase();

// Setup middleware
setupMiddleware(app);

// Use routes
app.use(authRoutes);
app.use(galleryRoutes);

app.get('/', (req, res) => {
    res.render('home', { session: req.session });
});

app.get('/register1', (req, res) => {
    res.render('register1', { session: req.session });
});

app.get('/login', (req, res) => {
    res.render('login', { secssion: req.session });
});

app.get('/loginNewuser', (req, res) => {
    res.render('loginNewuser', { session: req.session });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Node app is running at localhost:3000');
});