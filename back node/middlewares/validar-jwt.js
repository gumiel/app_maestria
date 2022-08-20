const { request, response } = require("express");
const jwt = require('jsonwebtoken')

const validarJWT = (req = request, resp = response, next )=>{
    
    const token = req.header('token')

    if( !token ){
        return resp.status(401).json({
            ok: false,
            msg: 'Error en el token'
        })
    }

    try {
        //retorna el payload uid, name
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED)

        console.log(uid, name);
        // por medio de express, usaremos el req para adicionar datos a esta ultima
        req.uid = uid;
        req.name = name;
        
    } catch (error) {
        console.log(error);

        return resp.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    //todo ok, llamar a next
    next()
}

module.exports ={
    validarJWT
}