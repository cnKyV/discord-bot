const MongoAdapter = require("../adapters/MongoDbAdapter");
const Log = require('../models/Log');
const Collection = require('../consts/InfrastructureConsts');
const LogConsts = require('../consts/LogConsts');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const db = new MongoAdapter(process.env.MONGODB_URL, process.env.MONGODB_DBNAME);

class LogRepository{
    static async insertLog(level, type, msg, discordIds)
    {
        await db.connect();
        
        const log = new Log({
            type: type,
            level: level,
            message: msg,
            discordUserIds: discordIds});

        await db.insertOne(log, Collection.Log);

    }
}

(async()=>{
    await LogRepository.insertLog(LogConsts.Level.Information, LogConsts.Type.Admin, 'TEST MESSAGE', ['34134','24352523','4325345']);
})();