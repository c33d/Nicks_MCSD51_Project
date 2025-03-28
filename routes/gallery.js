const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/gallery1', (req, res) => {
    if (req.session.loggedin) {
        res.render('gallery1.ejs', { session: req.session });
    } else {
        res.render('login.ejs', { session: req.session });
    }
});

router.get('/gallerybydate', (req, res) => {
    if (req.session.loggedin) {
        res.render('gallerybydate.ejs', { session: req.session });
    } else {
        res.render('login.ejs', { session: req.session });
    }
});

router.post('/update-category', (req, res) => {
    const { filename, newCategory } = req.body;

    fs.readFile('./public/database.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading database' });

        let images = JSON.parse(data);
        let image = images.find(img => img.filename === filename);

        if (image) {
            image.category = newCategory; // Update category
            fs.writeFile('./public/database.json', JSON.stringify(images, null, 2), (err) => {
                if (err) return res.status(500).json({ error: 'Error saving database' });
                res.json({ message: 'Category updated successfully' });
            });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    });
});

module.exports = router;