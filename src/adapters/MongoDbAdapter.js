const {MongoClient} = require('mongodb');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DBNAME;

const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

async function openConnection()
{
    try{
        await client.connect();

        const isConnected = client.topology.isConnected();
        if(isConnected)
        {
            console.log(`[INFO] Connection is established to collection: ${collectionName}`);
            return true;
        }   
    }
    catch(err){
        console.error(`[ERROR] Connection could not be established. Error Message: ${err}`);
        return false;
    }
}

async function closeConnection()
{
    try{
        const isConnected = client.topology.isConnected();

        if(isConnected)
        {
            console.log(`[INFO] Closing the connection.`);
            await client.close();
        }
    }
    catch(err){
        console.error(`[ERROR] Error occured while checking the connection status. Error Message: ${err}`);
    }
}

async function insertOneWithTransaction(entity)
{
    let collectionName;

    if( entity instanceof User)
        collectionName = 'user';

    if(entity instanceof Log)
        collectionName = 'log';

    if(collectionName !== undefined)
    {
        try
        {
            const isConnectionEstablished = await openConnection();

            if(isConnectionEstablished)
            {
                const db = client.db(dbName);
                const collection = db.collection(collectionName);
    
                const result = await collection.insertOne(entity);
    
                await closeConnection();
    
                console.log(`[INFO] A document has succesfully been inserted with the Id of ${result.insertedId}`);
            }
            else
                console.error(`[ERROR] Couldn't establish connection`);
        }
        catch(err)
        {
            console.error(`[ERROR] An error occurred whilst trying to insert a record. Error Message: ${err}`);
        }

    }


}



(async()=>{
await openConnection('user');
await closeConnection();
}
)();


