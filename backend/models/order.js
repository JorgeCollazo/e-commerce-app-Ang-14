const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({     // schemas in lowercase

})

exports.Order = mongoose.model('Order', orderSchema);   // Model in uppercase

// module.exports = mongoose.model('Post', postSchema);             // Another way to export