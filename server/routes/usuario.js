/**
 * controller de usuario
 */

const express = require('express');
const Usuario = require('../models/usuario');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {

    let pagina = parseInt(req.query.pagina) || 1;
    let items = parseInt(req.query.items) || 5;
    let desde = ((pagina - 1) * items) || 0;

    Usuario.find({})
        .skip(desde)
        .limit(items)
        .exec((err, lst_usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({}, (err, recordcount) => {
                res.json({
                    ok: true,
                    lst_usuarios,
                    recordcount
                });
            })

        });
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        // img: body.img,
        role: body.role
            // estado: body.estado,
            // google: body.google
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', (req, res) => {
    res.json('delete Usuario');
});

module.exports = app;