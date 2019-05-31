/**
 * rest express
 */

require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(require('./routes/usuario'));

mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online');
});

app.listen(port, () => {
    console.log(`Escuchando puerto ${ port }`);
});