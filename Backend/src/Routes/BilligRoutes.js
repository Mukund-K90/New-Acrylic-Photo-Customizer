const express = require('express');
const { placeOrder, getUserOrders, getBillingDetails, cancelUserOrder } = require('../controller/BillingController');
const router = express.Router();
const { authorization } = require('../middleware/auth.middleware');

router.post('/place-order', authorization, placeOrder);
router.get('/', authorization, getUserOrders);
router.get('/:orderId', authorization, getBillingDetails);
router.delete('/cancel-order/:orderId', authorization, cancelUserOrder);

module.exports = router;