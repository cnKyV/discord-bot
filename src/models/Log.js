const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: {type:String, required: true},
    type:{type:String,required: true},
    discordUserIds:[{type:String}]
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;