var express=require('express');
var app = express();
var session = require('express-session');
var conn = require('./dbConfig');
app.set('view engine','ejs');
app.use(session({
    secret: 'yoursecret',
    resave: true,
    saveUninitialized: true
}));
app.use('/public', express.static('public'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', function (req,res){
    res.render("home", { session: req.session });
    });
app.get('/page1', function (req,res){
    res.render("page1", { session: req.session });
    });
app.get('/login', function (req,res){
    res.render("login.ejs", { session: req.session });
    });
app.get('/grandpage', function (req,res){
    res.render("grandpage.ejs", { session: req.session });
    });
app.get('/register1', function (req,res){
    res.render("register1.ejs", { session: req.session });
    });
app.post('/register', function(req,res){  //Video 15/01 @ 30min
    res.send('This page is under construction.');

        let name = req.body.username;
        let password = req.body.password;
        let passwordVer = req.body.passwordVer;
        let email = req.body.email;

if(password == passwordVer){

        conn.query(
            'INSERT INTO users(id, name, password, email) VALUES ("${1001}", "${username}", "${password}", "${email}")', 
            
        function(error, results, fields) {
            if (error) {
                console.log('Oops an error occured executing the query', error);
            } 
            else {
                console.log('New user record has been added to the database');
                res.render('membersOnly', {user: username});
            }
        });
}


        // console.log(`Username: ${username}`);
        // console.log(`Email: ${email}`);
        // console.log(`Password: ${password}`);
        // console.log(`PasswordVer: ${passwordVer}`);
    
    // else{
    //     res.send('Passwords do not match!');
    // }
        //     res.end();
    })



   
app.post('/auth', function(req,res){  //Video 15/01 @ 30min
    let name = req.body.username;
    let password = req.body.password;

    if (name && password) {
        conn.query('SELECT * FROM users WHERE username = ? AND password = ?', [name, password],
        function(error, results, fields) {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).send('Internal Server Error');
            }

            if (!results || results.length === 0) {
                return res.send('Incorrect Username and/or Password!');

            }

            // Successful login
            req.session.loggedin = true;
            req.session.username = name;
            res.redirect('/membersOnly');
        });
            
    } else {
        res.send('Please enter Username and Password!');
        
    }
});


// Users can access this if they are logged in
app.get('/membersOnly', function (req,res){
    if (req.session.loggedin) {
        res.render("membersOnly");
    } else {
        res.send('Please login to view this page!');
    }
    //res.end();
});

app.get('/grandpage', function (req,res){res.render("grandpage");
});

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('Node app is running at localhost:3000');
});