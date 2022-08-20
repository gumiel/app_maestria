const { Router } = require('express');
const { check } = require('express-validator')
const { crearUsuario, loginUsuario, reValidarToken } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new',[
    check('name',"El name es obligatorio").not().isEmpty(),
    check('email',"El email es obligatorio").not().isEmpty(),
    check('email','El email no tiene el formato correcto').isEmail(),
    check('password',"El name es obligatorio").not().isEmpty(),
    check('password','El contraseña es obligatorio , no cumple con la cantidad de caracteres').isLength({min: 6}),
    validarCampos
], crearUsuario)


router.post('/',[
    check('email','El email no tiene el formato correcto').isEmail(),
    check('password','El contraseña es obligatorio , no cumple con la cantidad de caracteres').isLength({min: 6}),
    validarCampos,
] ,loginUsuario)

router.get('/renew',validarJWT ,reValidarToken)

module.exports = router