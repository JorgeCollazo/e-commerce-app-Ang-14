const {User} = require('../models/User');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {         // Moved to routes folder

    const userList = await User.find().select('-passwordHash');     // Added above async/await keywords instead of then/catch this time

    if(!userList) {
        res.status(500).json({success:false})
    }
    res.send(userList);   // Added above await because this will sent the productList before it gets full
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');  // To exclude some params
    if(!user) {
        return res.status(500).json({
            success:false,
            message: 'The user.ts with the given ID was not found'
        })
    }
    res.status(200).send(user);
})

router.get('/get/count', async (req, res) => {         // Moved to routes folder

    const usersCount = await User.countDocuments();     // Added above async/await keywords instead of then/catch this time
    console.log('productCount>>>>>>>>', usersCount);
    if(!usersCount) {
        res.status(500).json({success:false})
    }
    res.send({usersCount: usersCount});   // Added above await because this will sent the productList before it gets full
});


router.post('/', async (req, res) => {       // Moved to routes folder
    let newUser = new User({
        name:req.body.name,
        email:req.body.email,
        color: req.body.color,
        passwordHash: bcrypt.hashSync(req.body.password, 10),   // Salt param, extra secret param
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    newUser = await newUser.save();         // Async/Await way

    if(!newUser)
        return res.status(400).send('The user.ts cannot be created!')
    res.status(200).send(newUser);
    // newUser.save()                                   // Try/Catch way
    //     .then((createdUser) => {                     // User created after saving
    //         res.status(201).json(createdUser);       // Or create an object like below in the catch statement
    //     }).catch((err) => {
    //         res.status(500).json({
    //             error: err,
    //             success: false
    //         })
    // })
});

router.put('/:id', async (req, res) => {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(req.params.id,
        {
            name:req.body.name,
            email:req.body.email,
            color: req.body.color,
            passwordHash: newPassword,   // Salt param, extra secret param
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        {new: true}         // This extra option you're getting back the new updated object, otherwise you'll get the old one
    )
    if(!user)
        return res.status(404).send('No category found!!!')
    res.send(user);
})

router.delete('/:id', (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send('No user.ts ID found!!')
    }

    User.findByIdAndDelete(req.params.id).then((user) =>{
        if(user){
            return res.status(200).json({
                success: true,
                message: 'The user.ts was removed'
            })
        } else {
            return res.status(404).json({
                success: false,
                message: 'The user.ts was not removed'
            })
        }
    }).catch((err) =>{
        return res.status(500).json({success: false, message: err})
    })
})


router.post('/login', async (req, res) => {

    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;

    if(!user) {
        return res.status(404).send('The user.ts does not exist');
    }
    if (user && bcrypt.compareSync(req.body.password.toString(), user.passwordHash)) {

        const token = jwt.sign(
            {
                user_id: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1h'}       // 1d, 1w, 1m, etc
        )

        return res.status(200).send({user: user.email, token: token})
    } else {
        return res.status(400).send('Password is wrong!');
    }
})

module.exports = router;                // Exporting the module not the model