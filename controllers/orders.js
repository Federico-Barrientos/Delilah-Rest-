const controller = {};

const Sequelize = require('sequelize');
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);

const jwt = require('jsonwebtoken');
const signature = require('../server/jwt.js');

const catchSQLError = (res, err) => {
    console.log(err)
    res.status(500).json({
        mensaje : "Ocurrio un error",
        error: err
   });
};



controller.createOrder = (req, res) => {
    const productsArray = req.body.products; //me guarde array con id de productos a incluir en la order y la cantidad de cada uno
    const paymentMethod = req.body.payment_method;
    const idUser = req.locals.idUser; //guardo id del usuario que este haciendo la orden desde su token
    const products = req.locals.products; //tengo un array con los ids que guarde en req.locals en validation.ProductsIdExistCreateOrder
    // console.log(products);
    let description = [];
    let paymentValue = 0;
    products.forEach(product => {
        const reqProduct = productsArray.find(p => p.product_id === product.product_id); //busco para cada id guardado en products ese mismo id en productsArray donde también tengo guardada la cantidad de cada prodcuto
        product.product_amount = reqProduct.product_amount;
        console.log(reqProduct);
        product.subtotal = product.price * product.product_amount;
        paymentValue += product.subtotal; //calculo el total a pagar por la orden 
        description.push(`${reqProduct.product_amount}x ${product.name}`); //armo un array description con información de cada producto
    });
    console.log(parseInt(paymentValue));
    //valores a cargar en tabla Orderes de el nuevo pedido 
    const replacements = {
        idUser: idUser,
        state: 'nuevo',
        createdAt: new Date(),
        paymentMethod,
        paymentValue,
        description: description.join(' - ')
    };
    db.query(
        `
            INSERT INTO orders (user_id, order_state, order_date, order_description, payment_method, payment_amount)
            VALUES (:idUser, :state, :createdAt, :description, :paymentMethod, :paymentValue)
        `,
        { replacements }
    ).then (rta => {
        const idOrder = rta[0];
        const values = products.map(product => `(${product.product_id}, ${idOrder}, ${product.price}, ${product.product_amount}, ${product.subtotal})`);
        db
            .query(`
                INSERT INTO orders_products (product_id, order_id, product_price, product_amount, total)
                VALUES ${values.join(',')}
            `) //hago un bulk upload para cargar también la tabla orders_products con la información necesaria de la orden que esta siendo procesada
            .then(() => {
                res.status(201).json({
                    response: {
                        message: 'Order created successfully:',
                        rta
                    }
                });
            })
            .catch(err => catchSQLError(res, err))
    }).catch(err => catchSQLError(res, err))
}

module.exports = controller;