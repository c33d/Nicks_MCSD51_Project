const express = require('express');
const app = express();
const setupMiddleware = require('./middleware');
const authRoutes = require('./routes/auth');
const galleryRoutes = require('./routes/gallery');
const conn = require('./dbConfig');

app.set('view engine', 'ejs');

// Setup middleware
setupMiddleware(app);

// Use routes
app.use(authRoutes);
app.use(galleryRoutes);

app.get('/', (req, res) => {
    res.render('home', { session: req.session });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Node app is running at localhost:3000');
});