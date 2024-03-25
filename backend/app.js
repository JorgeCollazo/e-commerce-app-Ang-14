const express = require('express');
const app = express();
const morgan = require('morgan') ;   // morgan package
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');            // dotenv package
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handlers')

app.use(cors());        // Before anything else
app.options('*', cors());   // Allowing every http request from another origin when using this cors, this can also be done manually like in the Post projects

// const Product = require('./models/product');           // Moved to the routes/products


/* Middlewares (They check everything going to the server) */

app.use(express.json());              // Middleware which is more recent (Express 4.16.0 and later) than app.use(bodyParser.json()); const bodyParser = require("body-parser");
app.use(morgan('tiny'));       // The morgan middleware is a popular logging middleware for Node.js that helps in logging HTTP requests. The morgan middleware is configured with the 'tiny' format, which is a predefined log format that provides concise but useful information about incoming requests.
app.use(authJwt());                   // Using the express-jwt library to forbid no token authorization requests
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));    // In order to get access to the images turning into a static folder
app.use(errorHandler);              // This middleware will be executed whenever an error arises, Error Handling.


/* Routes */ 

const productsRoute = require('./routes/products');    // Added after moving the routes to routes/products
const categoriesRoute = require('./routes/categories');    // Added after moving the routes to routes/categories
const ordersRoute = require('./routes/orders');    // Added after moving the routes to routes/orders
const usersRoute = require('./routes/users');    // Added after moving the routes to routes/users

const api = process.env.API_URL;     // You can now call your .env variables

app.use(`${api}/products`, productsRoute);         // Added after moving the routes to routes/products
app.use(`${api}/categories`, categoriesRoute);         // Added after moving the routes to routes/products
app.use(`${api}/orders`, ordersRoute);         // Added after moving the routes to routes/products
app.use(`${api}/users`, usersRoute);         // Added after moving the routes to routes/products

// const productSchema = mongoose.Schema({     // schema in lowercase (moved to models folder)
//     name: String,
//     image: String,
//     countInStock: Number,
// })

// app.get(`${api}/products`, async (req, res) => {         // Moved to routes folder
//     // const product = {
//     //     id: 1,
//     //     name: 'hair dresser',
//     //     image: 'some_url'
//     // };
//     const productList = await Product.find();     // Added above async/await keywords instead of then/catch this time
//
//     if(!productList) {
//         res.status(500).json({success:false})
//     }
//     res.send(productList);   // Added above await because this will sent the productList before it gets full
// });
//
// app.post(`${api}/products`, (req, res) => {       // Moved to routes folder
//     // const newProduct = req.body;            // Commented in favor of below
//     const newProduct = new Product({
//         name:req.body.name,
//         image:req.body.image,
//         // countInStock:req.body.countInStock
//         countInStock: {
//             type: Number,
//             required: true          // We are making this field required in order to test error messages
//         }
//     })
//
//     newProduct.save()
//         .then((createdProduct) => {               // Product created after saving
//             res.status(201).json(createdProduct);   // Or create an object like below in the catch statement
//         }).catch((err) => {
//             res.status(500).json({
//                 error: err,
//                 success: false
//             })
//     })
//     // Commented out since we are already sending back the product
//     // res.send('New product was: ' + JSON.stringify(newProduct)); // This way you have to use JSON.stringify(newProduct));
//     // res.send(newProduct);
// });

/* Database */
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Connected to Mongo!!');
        console.log('pass!!');
    }).catch((err) => {
        console.log('Failed to connect to MongoDB!! ', err);
    })

/* Server */
app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
})
