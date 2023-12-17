const User = require('../models/User');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {         // Moved to routes folder

    const userList = await User.find();     // Added above async/await keywords instead of then/catch this time

    if(!userList) {
        res.status(500).json({success:false})
    }
    res.send(userList);   // Added above await because this will sent the productList before it gets full
});

router.post('/', (req, res) => {       // Moved to routes folder
    const newUser = new User({
        name:req.body.name,
        image:req.body.image,
        countInStock: {
            type: Number,
            required: true          // We are making this field required in order to test error messages
        }
    })

    newUser.save()
        .then((createdUser) => {               // Product created after saving
            res.status(201).json(createdUser);   // Or create an object like below in the catch statement
        }).catch((err) => {
            res.status(500).json({
                error: err,
                success: false
            })
    })
});

module.exports = router;                // Exporting the module not the model