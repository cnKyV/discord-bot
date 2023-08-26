const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: false},
    email: {type: String, required: false, unique: true},
    password: {type: String, required: false, select: false},
    discordUserId: {type: String, required: true},
    level:{type:Number, required:true, select:false},
    experience:{type:Number,required:true, select:false}
});

const User = mongoose.model('User', userSchema);

module.exports = User;