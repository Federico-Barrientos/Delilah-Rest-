const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);

const controller = require('../controllers/users');
const middle = require('../middlewares/middlewares');


//if the user is admin returns all the users, otherwise return the information of the user
router.get('/', middle.validateToken, controller.showUsers);

//login
router.get('/login', middle.loginCheck, middle.accountState, controller.login);

//create account
router.post('/', middle.checkUsernameExistence, middle.checkEmptyFieldsUser, controller.createAccount);

//create admin account
router.post('/admin', middle.checkUsernameExistence, middle.checkEmptyFieldsAdmin, controller.createAdmin);



















module.exports = router;