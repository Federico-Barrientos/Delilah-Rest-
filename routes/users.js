const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);

/////ROUTES USERS/////
//get all users
router.get('/', (req, res) => {
    db.query(
        'SELECT username FROM users',{
            type: db.QueryTypes.SELECT
        })
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            mensaje: 'Ocurrió un error con la base de datos',
            err: err
        });
    });
}) 
//post users
router.post('/', checkEmptyFieldsUser, checkUserExistence, (req,res) => {
    const nuevoUsuario = req.body;
    db.query(
        `INSERT INTO users (
            username,
            fullname,
            email,
            phoneNumber,
            user_address,
            password
        )
        VALUE (
            :username,
            :fullname,
            :email,
            :phoneNumber,
            :user_address,
            :password
        )`,
        {
            replacements: nuevoUsuario
        }
    ).then(() => {
        res.status(201).json({
            mensaje: 'El usuario: ' + nuevoUsuario.username + ' fue agregado con exito'
        });
    })
    .catch(err => {
        res.status(500).json({
            mensaje: 'Ocurrió un error con la base de datos',
            err: err
        });
    });
})

//middlewares//////////////////////////////////
function checkIfIdExists (req, res, next) {
    const user = req.body;

    db.query(
        'SELECT * FROM users WHERE id=:id',{
            type: db.QueryTypes.SELECT,
            replacements: {
                id: user.id
            }
        })
        .then(response => {
            if(response.length !== 0){
                res.status(404).json({
                    message: "The user you're looking for doesn't exist" 
                })
            }
            else{
                next();
            }
        })
}

function checkEmptyFieldsUser (req, res, next) {
    const fields = req.body;
    console.log(fields);
    if(!fields.username || !fields.fullname || !fields.email || !fields.phoneNumber || !fields.user_address || !fields.password){
        res.status(400).json({
            message: "There are some fields that are empty, remember the fields needed are (username, fullname, email, phoneNumber, user_addres, password)"
        })
    }else{
        next();
    }
}

//pendiente para arreglar
function checkUserExistence(req, res, next) {
    const fields = req.body;
    console.log(fields.username);
    db.query(
        'SELECT * FROM users WHERE username = :username ',
        {
            type: db.QueryTypes.SELECT,
            replacements: {username: fields.username}
        })
        .then(response => {
            response = response[0];
            console.log(response.username);
            if(response.length == ""){
                next();
            }
            else if(response.username == fields.username){
                res.status(409).json({message: "User already exists"})  
            }else if(response.email == fields.email){
                res.status(409).json({message: "email already in use"})  
            }else if(response.phoneNumber == fields.phoneNumber){
                res.status(409).json({message: "phoneNumber already in user"})  
            }
        })
            .catch(err => {
                res.status(500).json({
                    mensaje: 'Ocurrió un error con la base de datos',
                    err: err
                });
            });
}

module.exports = router;