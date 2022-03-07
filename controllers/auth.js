const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generateJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const emailExist = await Usuario.findOne({ email });

        if (emailExist) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }

        const usuario = new Usuario(req.body);
        // Encriptar contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // generar JWT

        const token = await generateJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar password
        const validatePassword = bcrypt.compareSync( password, usuarioDB.password );
        if (!validatePassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar JWT
        const token = await generateJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuarioDB,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }) 
    }
}

const renewToken = async( req, res = response ) => {

    const uid = req.uid;
    try {
        
        
        const token = await generateJWT( uid );

        const usuario = await Usuario.findById( uid );
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }
        
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }) 
    }


}

module.exports = {
    crearUsuario,
    login,
    renewToken
}