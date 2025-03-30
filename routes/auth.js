const express = require('express');
const router = express.Router();
const conn = require('../dbConfig');
const bcrypt = require('bcrypt');

router.post('/auth', async (req, res) => {
    let { username, password } = req.body;

    if (username && password) {
        conn.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).send('Internal Server Error');
            }

            if (results.length === 0) {
                return res.send('Incorrect Username and/or Password!');
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password); // Compare hashed password

            if (passwordMatch) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/gallery1');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
        });
    } else {
        res.send('Please enter Username and Password!');
    }
});

router.post('/register', async (req, res) => {
    let { username, password, passwordVer, email } = req.body;

    if (password === passwordVer) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            conn.query(
                'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                [username, hashedPassword, email],
                function (error) {
                    if (error) {
                        console.log('Error executing query:', error);
                        return res.status(500).send('Internal Server Error');
                    }
                    console.log('New user record has been added to the database');
                    res.render('loginNewuser', { user: username });
                }
            );
        } catch (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.send('Passwords do not match!');
    }
});

module.exports = router;