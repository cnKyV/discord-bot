const { insertOne, removeOne, updateOne, getOne, getAll, getOneByDiscordId } = require("../adapters/MongoDbAdapter");
var ObjectId = require('mongodb').ObjectId;
const {User} = require('../models/User');
const {returnTotalExpAndLevel} = require('../services/CalculationHelperService');
const {UserUpdateModel} = require('../models/User');

const COLLECTION_NAME = 'user';

async function addExperience(discordId, letterCount)
{
    let user = await getOneByDiscordId(discordId,COLLECTION_NAME);
    user = await returnTotalExpAndLevel(user, letterCount);

    var updateUser = new UserUpdateModel({discordUserId: user.discordUserId, email: user.email, experience: user.experience, id: user.id, level: user.level, name: user.name, password: user.password});
    const result = await updateOne(updateUser);
}

async function resetUser(discordId)
{
    

}

async function registerUser(user)
{

}

async function deleteUser(discordId)
{

}



(async()=> {
    await addExperience('1234567',300000);
})();