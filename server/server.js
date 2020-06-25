//Express
const express = require('express');
const server = express ();
//Body Parser
const bodyParser = require('body-parser');
//JSON Web Token
const jwt = require('jsonwebtoken');
const JWTSing = "Delilah_2020";
// DB Setup
const Sequelize = require('sequelize');
// const db = new Sequelize('mysql://${db_user}:${db_password}:@${db_host}:${db_port}/${db_name}');
const {db_user, db_password, db_host, db_port, db_name} = require('../database/db_connection');
const db = new Sequelize('mysql://root:@127.0.0.1:3306/delilah_resto');

//Server
server.listen(3000, () => {
    const date = new Date();
    console.log("Server initialized " + date);
})
server.use(bodyParser.json());

/////ROUTES USERS/////
//get all users
server.get('/users', (req, res) => {
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
server.post('/users', (req,res) => {
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
    ).then(response => {
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

////ROUTES PRODUCTS/////
//get all products
server.get('/products',(req, res) => {
    db.query(
        'SELECT * FROM products',{
            type: db.QueryTypes.SELECT
        })
        .then(() => {
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                mensaje: 'Ocurrió un error con la base de datos',
                err: err
        });
    });
});
//post a new product
server.post('/products', (req, res) => {
    const newProduct = req.body;
    db.query(
        `INSERT INTO products(
            name,
            price,
            description,
            img_url
        )
        VALUE(
            :name,
            :price,
            :description,
            :img_url
        )`,{
            replacements: newProduct
        })
        .then(() => {
            res.status(200).json("The product (" + newProduct.name + ") has been added to the menu");
        })
        .catch(err =>{
            res.json({
                mensaje:"Ocurrio un error inesperado",
                err: err
        });
    })
})

