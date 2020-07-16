const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);

const controller = require('../controllers/orders');
const middle = require('../middlewares/middlewares');

router.post('/',middle.both, middle.ProductsIdExistCreateOrder, controller.createOrder);


module.exports = router;