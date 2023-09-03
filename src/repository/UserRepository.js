const MongoAdapter = require("../adapters/MongoDbAdapter");
const CalculationHelper = require('../services/CalculationHelperService');
const Collection = require('../consts/InfrastructureConsts');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });


const db = new MongoAdapter(process.env.MONGODB_URL, process.env.MONGODB_DBNAME);

class UserRepository{
    async addExperience(discordId, letterCount)
    {
        await db.connect();
        let user = await db.getOneByDiscordId(discordId, Collection.User);
        user = await CalculationHelper.ReturnTotalExpAndLevel(user, letterCount);
    
        const result = await db.updateOne(user, Collection.User);
    }

    async getExperience(discordId)
    {
        await db.connect();
        let user = await db.getOneByDiscordId(discordId, Collection.User);

        return {level: user.level, experience: user.experience};
    }
    
    async resetUser(discordId)
    {
        await db.connect();
        let user = await db.getOneByDiscordId(discordId, Collection.User);
    
        user.level = 1;
        user.experience = 1;
        user.name = '';
        user.password = '';
    
        const result = await db.updateOne(user, Collection.User);
    
    }
    
    async registerUser(discordId)
    {
        await db.connect();
        let user = await db.getOneByDiscordId(discordId, Collection.User);
        const result = await db.insertOne(user);
    }
    
    async deleteUser(discordId)
    {
        await db.connect();
        const result = await db.removeOneByDiscordId(discordId,Collection.User);
    }
}

module.exports = UserRepository;





