const mongoose = require('mongoose');

const userSchema = mongoose.Schema({     // schemas in lowercase
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    passwordHash: {
      type: String,
      required:true
    },
    phone: {
      type: String,
      required:true
    },
    isAdmin: {
      type: Boolean,
      default:false
    },
    street: {
      type: String,
      default: ''
    },
    apartment: {
      type: String,
      default: ''
    },
    zip: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
    // countInStock: {
    //     type: Number,
    //     required: true
    // }
})

userSchema.virtual('id').get(function () {   // You cannot use an arrow function here because they do not have their own this context, they inherit it from the surrounding scope. In Mongoose virtuals, the this context is crucial, as it refers to the document.
    return this._id.toHexString();
})

userSchema.set('toJSON', {          // Enable the virtual for this schema
    virtuals: true,
});


exports.User = mongoose.model('User', userSchema);   // Model in uppercase
exports.userSchema = userSchema;

// module.exports = mongoose.model('Post', postSchema);             // Another way to export