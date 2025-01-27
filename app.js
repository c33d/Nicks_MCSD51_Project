var express=require('express');
var app = express();
app.set('view engine','ejs');
app.use('/public', express.static('public'));

app.get('/', function (req,res){
    res.render("home");
    });
app.get('/page1', function (req,res){
    res.render("page1");
    });
app.get('/grandpage', function (req,res){res.render("grandpage");
});

app.listen(3000);
console.log('Node app is running at localhost:3000');
