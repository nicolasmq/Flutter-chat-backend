
const express = require('express');
const path = require('path');
require('dotenv').config();

// DB config
require('./database/config').dbConnection();


// App Express
const app = express();

// Lectura y parseo del body
app.use(express.json());

// Servidor Node
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket')

// Path publico
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static( publicPath ) );


// Mis rutas

app.use( '/api/login', require('./routes/auth'));


server.listen( process.env.PORT, (err) => {

    if (err) throw new Error(err);

    console.log('Corriendo en puerto!!!', process.env.PORT)
});



