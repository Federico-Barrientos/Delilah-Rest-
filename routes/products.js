const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const signature = require('../server/jwt.js');

const Sequelize = require('sequelize');
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);

const controller = require('../controllers/products');
const middle = require('../middlewares/middlewares');

//ROUTES

//get all avalible products
router.get('/', middle.validateToken, controller.showAllProducts);

//get all products(only admin)
router.get('/allProducts',middle.isAdmin, controller.showAvaliblesProducts);

//get one product by id
router.get('/:id',middle.validateToken, controller.showProductById);

//post a new product
router.post('/', middle.isAdmin, middle.checkEmptyFields, middle.validateInfoProduct, controller.addProduct);

//update a existing product
router.put('/:id', middle.isAdmin, middle.checkIfProductExists, middle.checkEmptyFields, controller.editProduct);

//Disable a product
router.delete('/:id', middle.isAdmin, middle.checkIfProductExists, controller.disableProduct);

 





module.exports = router;