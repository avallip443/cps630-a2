const express   = require('express');
const cors      = require('cors');
const app       = express();
const path      = require('path');
const { default: mongoose } = require('mongoose');
const File = require('./models/File');

const PORT          = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

//Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

//database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/file_database`;
mongoose.connect(dbURL); 

const db = mongoose.connection;
db.on('error', function(e){
    console.log('error connecting: ', + e);
});

db.on('open', function() {
    console.log('database connected')
});



/* CREATE ITEM */

/* READ ITEM */

/* READ MULTIPLE ITEMS */

/* UPDATE ITEM */

/* DELETE ITEM */

//starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });