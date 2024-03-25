const mongoose = require('mongoose');

const productSchema = mongoose.Schema({     // schemas in lowercase
    name: {
        type: 'String',
        required: true,
    },
    description: {
        type: 'String',
        required: true,
    },
    richDescription: {
        type: 'String',
        default: ''
    },
    image: {
        type: 'String',
        default: ''
    },
    images: [{
        type: 'String',
    }],
    brand: {
      type: 'String',
      default: ''
    },
    price: {
        type: 'Number',
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,       // Category foreign key
        ref: 'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
})

productSchema.virtual('id').get(function () {   // You cannot use an arrow function here because they do not have their own 'this' context, they inherit it from the surrounding scope. In Mongoose virtuals, the this context is crucial, as it refers to the document.
    return this._id.toHexString();
})

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);   // Model in uppercase, when exporting like this you have to imported as an object then

// module.exports = mongoose.model('Post', postSchema);             // Another way to export a model