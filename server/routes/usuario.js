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
    let id = req.params.id;
    let fieldActive = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, fieldActive, { new: true }, (err, usrDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        };
        if (!usrDelete) {
            return res.status(400).json({
                ok: false,
                message: 'usuario ha desactivar no encontrado'
            });
        }
        res.json({
            ok: true,
            message: 'usuario desactivado correctamente',
            usuario: usrDelete
        });

    });
});

app.unlock('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let fieldActive = {
        estado: true
    };

    Usuario.findByIdAndUpdate(id, fieldActive, { new: true }, (err, usrActive) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'usuario ha activar no encontrado',
                err
            });
        };
        if (!usrActive) {
            return res.status(400).json({
                ok: false,
                message: 'usuario ha activar no encontrado'
            });
        };
        res.json({
            ok: true,
            message: 'usuario activado',
            usuario: usrActive
        });
    });
})

module.exports = app;