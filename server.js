const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const methodOverride = require('method-override');

const ObjectID = require('mongodb').ObjectID


const app = express();

const port = 8000;


app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');



MongoClient.connect(db.url, function(err, database){
    if (err) {
        return console.log(err);
    } else {
        require('./app/routes')(app, database.db());
        app.listen(port, function(){
            console.log('We are live on ' + port);
        });
    }
});