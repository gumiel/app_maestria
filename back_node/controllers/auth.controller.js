const bcryptjs = require('bcryptjs');
const { response, request } = require('express');
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');
//const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario')


const crearUsuario = async(req = request, resp = response) =>{

    //console.log(req.body);
    //desestructuracion de obj
    //const {email, name, password }= req.body;
  //  console.log(email, name, password);

  //----/---
  const {email, name, password }= req.body;

  try {
    //p1 Verficar el email
    const usuario = await Usuario.findOne({ email: email})

    if( usuario){
        return resp.status(400).json({
            ok: false,
            msg: 'El usuario ya existe con ese email'
        })
    }

    //p2 Crear usuario con el modelo
    const dbUser = new Usuario(req.body)

    //p5 Hashear la contraseña
    const salt = bcryptjs.genSaltSync();
    dbUser.password = bcryptjs.hashSync( password, salt )

    //Generar JWT
    const token = await generarJWT(dbUser.id, dbUser.name);

    //p3 Crear usuario de DB
    await dbUser.save();

    //p4 Generar respuesta existosa
    return resp.status(201).json({
        ok: true,
        uid: dbUser.id,
        name: name,
        email: dbUser.email,
        token: token
    })

  } catch (error) {
      console.log(error);
    return resp.status(500).json({
        ok: false,
        msg: 'Comuniquese con el administrador server'
    })
  }

    resp.json({
        ok: true,
        msg: 'Crear usuario /new'
    })
}
const loginUsuario = async(req = request, resp = response) =>{

   /*  const {email,  password }= req.body;
    console.log(email,  password); */

    try {

        const {email, password }= req.body;

        const dbUser = await Usuario.findOne({ email: email })

        //validar existencia de usuario
        if( !dbUser){
            return resp.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }
        //confirmar si el password hace match
        const validPassword = bcryptjs.compareSync( password, dbUser.password )

        if( !validPassword ){
            return resp.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            })
        }
        
        //genera el JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        //respuesta del servicio

       return resp.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        })

        
    } catch (error) {
        console.log(error);

        return resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador (server)'
        });
    }    
    
    resp.json({
        ok:true,
        msg: 'Login usuario'
    })
}

const reValidarToken = async(req = request, resp = response)=>{

   const { uid, name } = req;

   //const dbUser = await Usuario.findOne({ uid: uid})
   const dbUser = await Usuario.findById( uid)
    /* 
     const token = req.header('token')
    if( !token ){
        return resp.status(401).json({
            ok: false,
            msg: 'Error en el token'
        })
    } */

    const token = await generarJWT(uid, name);

    resp.json({
        ok: true,
        uid,
        name,
        email: dbUser.email,
        token,
        msg: 'token valido!!, validar y generar nuevo token'
    })
}

module.exports={
    crearUsuario,
    loginUsuario,
    reValidarToken,
}