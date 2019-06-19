const express = require('express'), app = express();

const mysql = require('mysql'),
      bodyParser = require('body-parser'),
      validator = require('validator');

const { check, validationResult } = require('express-validator/check');

app.set("view engine", "ejs");
//app.use(bodyParser());
//Permet de retirer les messages 'body-parser deprecated...'
app.use(bodyParser.urlencoded(
    {extended: true}
));

//Params de connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'nodemail'
});

//Connection
db.connect((err) => {
    if (err) throw err;
    console.log('Connection établie.');
});

//Affiche l'index
app.get('/', (req, res) => {
    res.render('index');
});

//Ajout Nom utilisateur et Mail dans DB
app.post('/ajout', (req, res) => {
    let post = {
        username: req.body.username, 
        usermail: req.body.usermail
    };

    if (validator.isEmail(post.usermail)) {
        let insertSql = 'INSERT INTO annuaire SET ?';
        let query = db.query(insertSql, post, (err, result) => {
            if(err) throw err;
            res.redirect('/');
        });
    } else res.send('Erreur - Vérifier que vous avez entré une adresse e-mail valide.');
});



app.listen(1234);