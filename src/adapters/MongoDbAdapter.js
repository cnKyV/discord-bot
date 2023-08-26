const {MongoClient} = require('mongodb');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });


async function main()
{
    const url = process.env.MONGODB_URL;
    const dbName = process.env.MONGODB_DBNAME;
    
    const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
    
    try
    {
        await client.connect();
        console.log('Connected to MongoDb');
    
        const db = client.db(dbName);
        const collection = db.collection('user');
    
        const user = new User({name:'Cenkay', discordUserId:'-', email:'test@gmail.com',experience:1,level:1,password:'strongpass'});
    
        var result = await collection.insertOne(user);
    
        console.log('Document inserted', result.insertedId);
    }
    catch(err)
    {
    console.error('Error',err);
    }
    finally
    {
    client.close();
    }
}

main();