const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);

//ROUTES

//get all avalible products
router.get('/',(req, res) => {
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

//post a new product
router.post('/', checkEmptyFields, validateInfo, (req, res) => {
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

//get all products(only admin)
router.get('/allProducts',(req, res) => {
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
router.get('/:id', (req, res) => {
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

//update a existing user 
router.put('/:id', checkIfProductExists, checkEmptyFields, (req, res) => {
    const id = req.params.id;
    const newValues = req.body;

    console.log("HOLIS = " + newValues.is_active);

    db.query(
        `SELECT * FROM products WHERE product_id = :id`, {
            type: db.QueryTypes.SELECT,
            
                replacements: {id: id}
        })
        .then(response => {
            if(response.length !== 0) {
                db.query(`UPDATE products
                 SET name = :name, price = :price, description = :description, img_url = :img_url, is_active = :is_active
                 WHERE product_id = :id`,{
                    replacements: {
                        name: newValues.name,
                        price: newValues.price,
                        description: newValues.description,
                        img_url: newValues.img_url,
                        is_active: newValues.is_active,
                        id: id
                    }
                 })
                 .then(response => {
                     res.status(202).json({
                         message: "The product (" + newValues.name + ") was succefully edited"
                     })
                 })
            }else {
                res.status(404).json({
                    mensaje: 'product not found'
                })
            }
        })
        .catch(err =>{
            res.json({
                mensaje:"Ocurrio un error inesperado",
                err: err
        });
    })
})

//Disable a product
router.delete('/:id', checkIfProductExists, (req, res) => {
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

 
////MIDDLEWARES
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

function checkEmptyFields (req, res, next) {
    const fields = req.body;
    console.log(fields);
    if(!fields.name || !fields.price || !fields.description || !fields.img_url || !fields.is_active){
        res.status(400).json({
            message: "There are some fields that are empty, remember the fields needed are (name, price, description, img_url)"
        })
    }else{
        next();
    }
}



module.exports = router;