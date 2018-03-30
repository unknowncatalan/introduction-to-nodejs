const mongoose = require("mongoose");
const UniqueValidator = require('mongoose-unique-validator');

var AccountSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    balance: {type: Number}
});

AccountSchema.plugin(UniqueValidator);

var Account = mongoose.model('Account', AccountSchema);

module.exports = {
    Account: Account
}