const express = require('express');
const { createOrder, getOrderDetails } = require('../controller/orderContoller');
const router = express.Router();
const {authorization}=require('../middleware/auth.middleware');

//create order
router.post('/create',authorization,createOrder );
//get order details
router.get('/details/:receiptId',getOrderDetails);

module.exports = router;