const MongoAdapter = require("../adapters/MongoDbAdapter");
const Log = require('../models/Log');
const Collection = require('../consts/InfrastructureConsts');
const LogConsts = require('../consts/LogConsts');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const db = new MongoAdapter(process.env.MONGODB_URL, process.env.MONGODB_DBNAME);

class LogRepository{
    async insertLog(){

    }

}
