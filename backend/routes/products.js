const {Product} = require('../models/Product'); // This should be imported as an object (Destructuring)
const express = require('express');
const {Category} = require("../models/category");
const router = express.Router();
const mongoose = require('mongoose');


router.get('/', async (req, res) => {         // Moved to routes folder
    // localhost:3000/api/v1/products?categories=234325,798621      // Using Query params, instead of URL params or body params
    // const productList = await Product.find();     // Added above async/await keywords instead of then/catch this time
    // const productList = await Product.find().select('name -_id');   // If you want to send just some properties, separated by spaces, minus to exclude the ID
    // This way using query params:
    let filter = {};
    if(req.query.categories) {
        filter = {category: req.query.categories.split(',')};
    }

    // const productList = await Product.find({category:["234325", "798621"]}).populate('category');   // If you want to send also the properties of a foreign key item
    const productList = await Product.find(filter).populate('category');   // If you want to send also the properties of a foreign key item

    if(!productList) {
        res.status(500).json({success:false})
    }
    res.send(productList);   // Added above await because this will sent the productList before it gets full
});

router.get('/:id', async (req, res) => {         // Moved to routes folder

    const product = await Product.findById(req.params.id);     // Added above async/await keywords instead of then/catch this time

    if(!product) {
        res.status(500).json({success:false})
    }
    res.send(product);   // Added above await because this will sent the productList before it gets full
});

router.get('/get/count', async (req, res) => {         // Moved to routes folder

    const productCount = await Product.countDocuments();     // Added above async/await keywords instead of then/catch this time
    console.log('productCount>>>>>>>>', productCount);
    if(!productCount) {
        res.status(500).json({success:false})
    }
    res.send({productCount: productCount});   // Added above await because this will sent the productList before it gets full
});

router.get('/get/featured/:count', async (req, res) => {         // Moved to routes folder
    const productLimit = req.params.count ? req.params.count : 0;
    const products = await Product.find({isFeatured: true}).limit(productLimit);     // To find all objects with that property, later added productLimit to limit the search

    if(!products) {
        res.status(500).json({success:false})
    }
    res.send(products);
});

router.post('/', async(req, res) => {       // Moved to routes folder

    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(404).send('No category found!!')
    }

    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })

    newProduct.save()
        .then((createdProduct) => {                      // Product created after saving using then/catch statements or can be created with async/await
            res.status(201).json(createdProduct);     // Or create an object like below in the catch statement
        }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
});

router.put('/:id', async (req, res) => {
    if(! mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send('No product ID found!!')
    }
    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(404).send('No category found!!')
    }
    const editedProduct = await Product.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        {new: true}         // This extra option you're getting back the new updated object, otherwise you'll get the old one
    )
    console.log('editedProduct>>>>>>>>>', editedProduct);
    if(!editedProduct)
        return res.status(404).send('The product could not be updated !!!')
    res.send(editedProduct);
})

router.delete('/:id', (req, res) => {
    if(! mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send('No product ID found!!')
    }

    Product.findByIdAndDelete(req.params.id).then((product) =>{
        if(product){
            return res.status(200).json({
                success: true,
                message: 'The product was removed'
            })
        } else {
            return res.status(404).json({
                success: false,
                message: 'The product was not removed'
            })
        }
    }).catch((err) =>{
        return res.status(500).json({success: false, message: err})
    })
})

module.exports = router;                // Exporting the module