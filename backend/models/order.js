const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({     // schemas in lowercase
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,       // OrderItem foreign key
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
      type: String,
    },
    city: {
      type: String,
      required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
})

orderSchema.virtual('id').get(function () {   // You cannot use an arrow function here because they do not have their own 'this' context, they inherit it from the surrounding scope. In Mongoose virtuals, the this context is crucial, as it refers to the document.
    return this._id.toHexString();
})

orderSchema.set('toJSON', {
    virtuals: true,
});


exports.Order = mongoose.model('Order', orderSchema);   // Model in uppercase

// module.exports = mongoose.model('Post', postSchema);             // Another way to export