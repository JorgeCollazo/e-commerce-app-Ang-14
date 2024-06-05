const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({     // schemas in lowercase
    name: {
        type: 'string',
        required: true
    },
    icon: {
        type: 'string',
    },
    color: {
        type: 'string',
    },
})

categorySchema.virtual('id').get(function () {   // You cannot use an arrow function here because they do not have their own 'this' context, they inherit it from the surrounding scope. In Mongoose virtuals, the this context is crucial, as it refers to the document.
    return this._id.toHexString();
})

categorySchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('Category', categorySchema);   // Model in uppercase

// module.exports = mongoose.model('Post', postSchema);             // Another way to export