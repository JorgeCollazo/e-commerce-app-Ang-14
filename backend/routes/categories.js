const express = require('express');
const router = express.Router();
const {Category} = require('../models/category');       // Import it like an object


router.get('/', async (req, res) => {         // Moved to routes folder

    const categoryList = await Category.find();     // Added above async/await keywords instead of then/catch this time

    if(!categoryList) {
        res.status(500).json({success:false})
    }
    res.status(200).send(categoryList);   // Added above await because this will sent the productList before it gets full
});

router.get('/:id', async (req, res) => {         // Moved to routes folder
    const category = await Category.findById(req.params.id);     // Added above async/await keywords instead of then/catch this time
    if(!category) {
        return res.status(500).json({
            success:false,
            message: 'The category with the given ID was not found'
        })
    }
    res.status(200).send(category);   // Added above await because this will sent the productList before it gets full
});

router.post('/', async (req, res) => {

    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();       // This time we're going to use await/async statements

    if(!category) {
        return res.status(404).send('The category could not be created')
    }

    res.status(200).send(category);
})

router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        {new: true}         // This extra option you're getting back the new updated object, otherwise you'll get the old one
    )
    if(!category)
        return res.status(404).send('No category found!!!')
    res.send(category);
})
router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id).then((category) =>{
        if(category){
            return res.status(200).json({
                success: true,
                message: 'The category was removed'
            })
        } else {
            return res.status(404).json({
                success: false,
                message: 'The category was not removed'
            })
        }
    }).catch((err) =>{
        return res.status(500).json({success: false, message: err})
    })
})

module.exports = router;                // Exporting the module