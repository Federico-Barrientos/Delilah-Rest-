const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);

const jwt = require('jsonwebtoken');
const signature = require('../server/jwt.js');


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
router.post('/', checkUsernameExistence, checkEmptyFieldsUser, (req,res) => {
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
//login
router.get('/login', loginCheck, accountState, (req, res) => {
    const input = req.body;
    db.query(
        'SELECT * FROM users WHERE username = :username',{
            type: db.QueryTypes.SELECT,
            replacements: {username: input.username}
        })
        .then(response =>{
            const data = response[0];
            const token = createToken({
                username: data.username,
                user_id: data.user_id,
                is_admin: data.is_admin,
                is_active: data.is_active
            });
            res.status(200).json(token);
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

function checkUsernameExistence(req, res, next) {
    const fields = req.body;
    db.query(
        'SELECT * FROM users WHERE username = :username ',
        {
            type: db.QueryTypes.SELECT,
            replacements: {username: fields.username}
        })
        .then(response => {
            // response = response[0];

            if(response.length !== 0){
                res.status(409).json({message: "User already exists"})   
            }else{
                next();
            }
        })
            .catch(err => {
                res.status(500).json({
                    mensaje: 'Ocurrió un error con la base de datos',
                    err: err
                });
            });
}

function loginCheck(req, res, next) {
    const {username, password} = req.body;
    db.query(
        'SELECT * FROM users WHERE username = :username AND password = :password ',
        {
            type: db.QueryTypes.SELECT,
            replacements: {username: username,
                           password: password}
        })  
        .then(response => {
            // response = response[0];

            if(response.length == 0){
                res.status(409).json({message: "Username or password invalid"})   
            }else{
                next();
            }
        })
            .catch(err => {
                res.status(500).json({
                    mensaje: 'Ocurrió un error con la base de datos',
                    err: err
                });
            });
}

function accountState(req, res, next){
    const input = req.body;
    db.query(
        'SELECT is_active FROM users WHERE username = :username',{
            type: db.QueryTypes.SELECT,
            replacements: {username: input.username}
        })
        .then(response => {
            const data = response[0];
            console.log(data);
            if(data.is_active == 1){
                next();
            }else{
                res.status(409).json({message: "The account is disabled"});
            }
        })
        .catch(err => {
            res.status(500).json({
                mensaje: 'Ocurrió un error con la base de datos',
                err: err
            });
    });
}

function createToken(info){
    return jwt.sign(info, signature);
}


module.exports = router;