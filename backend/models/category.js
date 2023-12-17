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

exports.Category = mongoose.model('Category', categorySchema);   // Model in uppercase

// module.exports = mongoose.model('Post', postSchema);             // Another way to export