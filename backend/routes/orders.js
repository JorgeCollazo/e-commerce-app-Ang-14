const Order = require('../models/order');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {         // Moved to routes folder

    const orderList = await Order.find();     // Added above async/await keywords instead of then/catch this time

    if(!orderList) {
        res.status(500).json({success:false})
    }
    res.send(orderList);   // Added above await because this will sent the productList before it gets full
});

module.exports = router;                // Exporting the module