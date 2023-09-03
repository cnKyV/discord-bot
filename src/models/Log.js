const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: {type:String, required: true},
    type:{type:String,required: true},
    level:{type:String, required: true},
    discordUserIds:[{type:String, required: true}],
    createdAt: {type:Date, default: Date.now}
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;