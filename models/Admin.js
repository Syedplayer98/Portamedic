const mongoose = require('mongoose');

const adminSchema  = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 35
    },
    Date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Admin',adminSchema);