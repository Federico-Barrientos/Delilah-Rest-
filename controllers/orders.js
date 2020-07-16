const controller = {};

const Sequelize = require('sequelize');
const { db_host, db_name, db_user, db_password, db_port } = require("../database/db_connection");
const db = new Sequelize(`mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);

const jwt = require('jsonwebtoken');
const signature = require('../server/jwt.js');

controller.createOrder = (req, res) => {
    const productsArray = req.body.products; 
    const paymentMethod = req.body.payment_method;
    const idUser = req.locals.idUser; 
    const products = req.locals.products; 

    let description = [];
    let paymentValue = 0;

    products.forEach(product => {
        const reqProduct = productsArray.find(p => p.product_id === product.product_id); 
        product.product_amount = reqProduct.product_amount;
        console.log(reqProduct);
        product.subtotal = product.price * product.product_amount;
        paymentValue += product.subtotal; 
        description.push(`${reqProduct.product_amount}x ${product.name}`);
    });
    
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
            `) 
            .then(() => {
                res.status(201).json({
                    response: {
                        message: 'Order created successfully:',
                        rta
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    mensaje: 'Ocurrió un error con la base de datos',
                    err: err
                });
            });
    }).catch(err => {
        res.status(500).json({
            mensaje: 'Ocurrió un error con la base de datos',
            err: err
        });
    });
}

controller.EditOrderState = (req, res) => {
    const id = req.params.id;
    const newState = req.body.newState;
    const updatedAt = new Date();
    db.query(
        'SELECT * FROM orders WHERE order_id = :id',{
            type: db.QueryTypes.SELECT,
            replacements: {id: id}
        })
        .then(response => {
            
            if(response.length === 0){
                res.status(404).json({message: "The order you're looking for does not exists"})
            }else{
                const idOrder = response[0].order_id;
                db.query(
                    'UPDATE orders SET order_state = :state, updatedAt = :updatedAt WHERE order_id = :id',{
                        replacements:{state: newState, updatedAt: updatedAt, id: idOrder}
                    })
                    .then(response => {
                        res.status(202).json({message: "The order was succesfully Edited"})
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                mensaje: 'Ocurrió un error con la base de datos',
                err: err
            });
        });
}
module.exports = controller;