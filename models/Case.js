const mongoose = require('mongoose');

const caseSchema = mongoose.Schema({
    agentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Agent',
        required:true
    },
    name1: {
        type: String,
        required: true
    },
    name2: {
        type: String,
    },
    DOB: {
        type: Date,
        required: true
    },
    Policy:{
        type: String,
        required: true
    },
    Amount:{
        type: Number,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    PhoneNo : {
        type: Number,
        required: true
    },
    ScheduledDate: {
        type: Date,
        required: true
    },
    Time : {
        type: String,
        required: true
    },
    AgentComment : {
        type: String,
        default: null
    },
    AdminComment : {
        type: String,
        default: null
    },
    value1 : {
        type: String,
        default: "---"
    },
    value2 : {
        type: String,
        default: "---"
    },
    value3 : {
        type: String,
        default: "---"
    },
    value4 : {
        type: String,
        default: "---"
    },
    value5 : {
        type: String,
        default: "---"
    },
    Status : {
        type: String,
        default:"Pending"
    }
});

module.exports = mongoose.model('Case',caseSchema);