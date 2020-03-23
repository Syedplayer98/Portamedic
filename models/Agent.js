const mongoose = require('mongoose');

const agentSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    AgencyName: {
        type: String,
        required: true
    },
    InsuranceCompany : {
        type: String,
        required: true
    },
    PhoneNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Agent',agentSchema);