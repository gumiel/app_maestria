const express = require('express')
const cors = require('cors')
const path = require('path')
const { dbConnection } = require('./db/config');
require('dotenv').config()

//console.log(process.env);

//servicod / app de express

const app = express();

//DB
dbConnection()

app.use(express.static('public'));

//CORS
app.use( cors() );

//Lectura y pasrseo del body
app.use( express.json() );

//MANEJAR DEMAS RUTAS
/* app.get('*', (req, res)=>{
    //res.sendFile(path.resolve( __dirname, 'public/index.html' ))
    res.sendFile(path.dirname( 'public/index.html' ))
}) */

/* app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
}); */

//rutas con el middelware'use'
app.use('/api/auth', require('./routes/auth.route'));

//GET
/* app.get('/', (req, res) =>{
    res.json({
        ok: true,
        msg: 'Todo bien',
        uid: 234
    })
}) */

app.listen( process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puesto ${  process.env.PORT }`);
})
