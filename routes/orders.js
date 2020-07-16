const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);

const controller = require('../controllers/orders');
const middle = require('../middlewares/middlewares');

router.get('/', middle.validateToken , controller.getOrders);

router.post('/',middle.validateToken, middle.ProductsIdExistOrder, controller.createOrder);

router.put('/:id', middle.isAdmin, controller.EditOrderState);

module.exports = router;