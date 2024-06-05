const {Product} = require('../models/Product'); // This should be imported as an object (Destructuring)
const express = require('express');
const {Category} = require("../models/category");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',

}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let errorUpload = new Error('Invalid image type')
        if(isValid) {
            errorUpload = null;
        }
        cb(errorUpload, 'public/uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)          // Way 1
        // cb(null, file.fieldname + '-' + uniqueSuffix)
        const fileName = file.originalname.toLowerCase().split(' ').join("-");     // Way 2
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage })

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

router.post('/', uploadOptions.single('image'), async(req, res) => {       // Moved to routes folder

    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(404).send('No category found!!')
    }
    const file = req.file;
    if(!file) {
        return res.status(404).send('No image in the request!!')
    }
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
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

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send('No product ID found!!')
    }
    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(404).send('No category found!!')
    }

    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).send('No product found!!')

    const file = req.file;
    let imagePath;

    if(file) {
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
        imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = product.image;
    }

    const editedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagePath,
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

    if(!editedProduct)
        return res.status(404).send('The product could not be updated !!!')
    res.send(editedProduct);
})

router.delete('/:id', (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send('No product ID found!!')
    }

    Product.findByIdAndDelete(req.params.id).then((product) => {
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
    }).catch((err) => {
        return res.status(500).json({success: false, message: err})
    })
})

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send('No product ID found!!')
    }

    let imagesPath = [];
    const files = req.files;
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    if(files) {
        files.map(file => {
            imagesPath.push(`${basePath}${file.filename}`)
        })
    }
    const editedProduct = await Product.findByIdAndUpdate(req.params.id,
        {
            images: imagesPath,
        },
        {new: true}
    )

    if(!editedProduct)
        return res.status(404).send('The product could not be updated !!!')
    res.send(editedProduct);

})

module.exports = router;                // Exporting the module