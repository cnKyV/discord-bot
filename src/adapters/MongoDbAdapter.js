const {MongoClient} = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
const {User} = require('../models/User');
const {UserUpdateModel} = require('../models/User');
const Log = require('../models/Log');
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
            console.log(`[INFO] Connection is established.`);
            return true;
        }

        return false;
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

async function insertOne(entity)
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

async function updateOne(updateModel)
{
    let collectionName;

    if(updateModel instanceof UserUpdateModel && updateModel.id != null)
    {
        collectionName = 'user';
    }

    if(collectionName !== undefined)
    {
        const isConnectionEstablished = await openConnection();

        if(isConnectionEstablished)
        {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            const id = new ObjectId(updateModel.id);

            const user = updateModel.toObject();
            
            delete user.id;
            delete user._id;

            const result = await collection.updateOne({_id: id}, {$set: user});

            console.log(`[INFO] A document has succesfully been inserted with the count of ${result.modifiedCount}`);
        }
    }
}

async function removeOne(id, collectionName)
{
    let collection;

    if(!(id instanceof ObjectId))
        id = new ObjectId(id);

    if(collectionName === 'user')
        collection = collectionName;

    if(collection !== undefined)
    {
        const isConnected = await openConnection();

        if(isConnected)
        {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            const result = await collection.deleteOne({_id : id});
            console.log(`[INFO] A document has been deleted with the Id of: ${id}. `);
        }
    }
}

module.exports = {insertOne, removeOne, updateOne};

