const {Order} = require('../models/order');
const express = require('express');
const {OrderItem} = require("../models/order-item");
const router = express.Router();


router.get('/', async (req, res) => {         // Moved to routes folder

    const orderList = await Order.find().populate('user', 'name').sort({dateOrdered : 'desc'});     // Added above async/await keywords instead of then/catch this time, Populate brings all data from the foreign key. The 2nd parameter is the field(s) you want to bring

    if(!orderList) {
        res.status(500).json({success:false})
    }
    res.send(orderList);   // Added above await because this will sent the productList before it gets full
});

router.get('/:id', async (req, res) => {         // Moved to routes folder

    const order = await Order.findById(req.params.id)
        .populate('user', 'name')                       // Added above async/await keywords instead of then/catch this time, Populate brings all data from the foreign key. The 2nd parameter is the field(s) you want to bring
        // .populate('orderItems');                                 // Populate brings all data from the foreign key. The 2nd parameter is the field(s) you want to bring
        // .populate({path: 'orderItems', populate: 'product'});    // This way I can populate also the products inside orderItems
        .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}});    // This way I can populate also the categories inside products inside orderItems

    if(!order) {
        res.status(500).json({success:false})
    }
    res.send(order);   // Added above await because this will sent the productList before it gets full
});

router.get('/get/count', async (req, res) => {         // Moved to routes folder

    const orderCount = await Order.countDocuments((count) => count)

    if(!orderCount) {
        res.status(500).json({success:false})
    }
    res.send({orderCount: orderCount});
});

router.get('/get/ordersByUser/:userId', async (req, res) => {         // Moved to routes folder

    const userOrderList = await Order.find({user: req.params.userId})
        .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}})
        .sort({dateOrdered : 'desc'});     // Added above async/await keywords instead of then/catch this time, Populate brings all data from the foreign key. The 2nd parameter is the field(s) you want to bring

    if(!userOrderList) {
        res.status(500).json({success:false})
    }
    res.send(userOrderList);   // Added above await because this will sent the productList before it gets full
});

router.post('/', async (req, res) => {

    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {      // Promise.all() Method is used here to unify the returned promises

        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product,
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    console.log('orderItemsIds Before >>>>>>>', orderItemsIds)
    const orderItemsIdsResolved = await orderItemsIds                   //Resolving the one total promise, it's more efficient like below though
    console.log('orderItemsIds After >>>>>>>', orderItemsIdsResolved)

    const orderItemTotalPrice = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
        return orderItem.product.price * orderItem.quantity;
    }))
    // console.log('orderItemTotalPrice>>>>>>>>>>>>>>>', orderItemTotalPrice);
    const totalPrice = orderItemTotalPrice.reduce((a,b) => a + b, 0)
    console.log('totalPrice>>>>>>>>>>>>>>>', totalPrice);
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    order = await order.save();       // This time we're going to use await/async statements

    if(!order) {
        return res.status(404).send('The order could not be created')
    }

    res.status(200).send(order);
})

router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id,
        {
            status: req.body.status,
        },
        {new: true}         // This extra option you're getting back the new updated object, otherwise you'll get the old one
    )
    if(!order)
        return res.status(404).send('No order found!!!')
    res.send(order);
})

router.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(async (order) => {
        if(order){
            await order.orderItems.map(async (orderItem) => {               // Here orderItems store just the IDs
                await OrderItem.findOneAndDelete(orderItem)                     // To delete each orderItem
            })
            return res.status(200).json({
                success: true,
                message: 'The order was removed'
            })
        } else {
            return res.status(404).json({
                success: false,
                message: 'The order was not removed'
            })
        }
    }).catch((err) =>{
        return res.status(500).json({success: false, message: err})
    })
})


module.exports = router;                // Exporting the module

