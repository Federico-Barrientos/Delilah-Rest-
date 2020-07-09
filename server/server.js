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
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const { response } = require('express');
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);


//Server
server.listen(3000, () => {
    const date = new Date();
    console.log("Server initialized " + date);
})
server.use(bodyParser.json());


////ROUTES PRODUCTS/////
//get all avalible products
server.get('/products',(req, res) => {
    db.query(
        'SELECT name, price, description, img_url FROM products WHERE is_active = TRUE',{
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
});

//get all products(only admin)
server.get('/products_admin',(req, res) => {
    db.query(
        'SELECT * FROM products',{
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
});

//get one product by id
server.get('/products/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        `SELECT * FROM products WHERE product_id = :id`, {
            type: db.QueryTypes.SELECT,
            
                replacements: {id: id}
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


//post a new product
server.post('/products', validateInfo, (req, res) => {
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

//update a existing user (todavia no funciona)

// server.put('products/:id', (req, res) => {
//     const id = req.params.id;
//     const newValues = req.body;
//     console.log("HOLIS" + id);
//     console.log("GG" + newValues);

//     db.query(
//         `SELECT * FROM products WHERE product_id = :id`, {
//             type: db.QueryTypes.SELECT,
            
//                 replacements: {id: id}
//         })
//         .then(response => {
//             if(response.length !== 0) {
//                 db.query(`UPDATE products
//                  SET name = :name, price = :price, description = :description, img_url = :img_url, is_active = :is_active
//                  WHERE product_id = :id`,{
//                     replacements: {
//                         name: newValues.name,
//                         price: newValues.price,
//                         description: newValues.description,
//                         img_url: newValues.img_url,
//                         is_active: newValues.is_active,
//                         id: id
//                     }
//                  })
//             }else {
//                 res.status(404).json({
//                     mensaje: 'product not found'
//                 })
//             }
//         })
//         .catch(err =>{
//             res.json({
//                 mensaje:"Ocurrio un error inesperado",
//                 err: err
//         });
//     })
// })

//Disable a product
server.delete('/products/:id', checkIfProductExists, (req, res) => {
    const product = req.params.id;

    db.query(
        'UPDATE products SET is_active = false WHERE product_id = :id',{
            replacements: {id : product}
        })
        .then(response => {
            res.status(202).json({
                message: "the product has been disabled"
        })
    })  
})

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

function validateInfo(req, res , next) {
    const newProduct = req.body;

    db.query(
        'SELECT name FROM products WHERE name=:name',{
            type: db.QueryTypes.SELECT,
            replacements : {
                name: newProduct.name
            }
        })
        .then(response => {
            if(response.length !== 0){
                res.status(409).json({
                    message: 'The product ' + newProduct.name + ' Already exists'
                })
            }
            else{
                next();
            }
        })
}

function checkIfUserExists (req, res, next) {
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

function checkIfProductExists (req, res, next) {
    const product = req.params.id;


    db.query(
        'SELECT * FROM products WHERE product_id = :id',{
            type: db.QueryTypes.SELECT,
            replacements: {
                id: product
            }
        })
        .then(response => {
            // console.log("holis" + JSON.stringify(response[0].product_id));
            if(response.length == 0){
                res.status(404).json({
                    message: "The product you're looking for doesn't exist" 
                })
            }
            else{
                next();
            }
        })
}