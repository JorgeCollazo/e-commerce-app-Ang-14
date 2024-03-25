const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({     // schemas in lowercase
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);   // Model in uppercase

// module.exports = mongoose.model('Post', postSchema);             // Another way to export