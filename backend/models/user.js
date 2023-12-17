const mongoose = require('mongoose');

const userSchema = mongoose.Schema({     // schemas in lowercase
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

exports.User = mongoose.model('User', userSchema);   // Model in uppercase

// module.exports = mongoose.model('Post', postSchema);             // Another way to export