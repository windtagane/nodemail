const express = require('express'), app = express();

const mysql = require('mysql'),
      bodyParser = require('body-parser'),
      validator = require('validator'),
      ejslint = require('ejs-lint');

const { check, validationResult } = require('express-validator/check');

let annuaire = 0;

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

//Affiche l'index et les données de la table annuaire
app.get('/', (req, res) => {
    let showSql = 'SELECT * FROM annuaire';
    db.query(showSql, (err, result) => {
        if (err) throw err;
        res.render('index', {
            annuaire : result
        });
    });
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

//Supprime une donnée dans la table annuaire
app.post('/suppr/:id', (req, res) => {
    let paramId = req.params.id;
    let deleteSql = 'DELETE FROM annuaire WHERE id = ' + paramId;
    let query = db.query(deleteSql, (err, result) => {
        if(err) throw err;
        res.redirect('/');
    })
});

//Edite la donnée
app.post('/edit/:id', (req, res) => {
    let paramId = req.params.id;
    
    db.query(editSql, (err, result) => {
        if(err) throw err;
        res.redirect('/edit/:id');
    })
})

//Update
app.post('/update/:id', (req, res) => {
    let paramId = req.params.id;
    let updateSql = 'UPDATE INTO annuaire WHERE id =' + paramId;
    db.query(updateSql, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    })
})

app.listen(1234);