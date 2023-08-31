const { insertOne, removeOne, updateOne, getOne, getAll, getOneByDiscordId } = require("../adapters/MongoDbAdapter");
var ObjectId = require('mongodb').ObjectId;
const {User} = require('../models/User');
const {UserUpdateModel} = require('../models/User');

const COLLECTION_NAME = 'user';

async function addExperience(discordId, letterCount)
{
    const userJson = await getOneByDiscordId(discordId,COLLECTION_NAME);

    const user = new User(userJson);
}


(async()=> {
    await addExperience('1234567',123);
})();