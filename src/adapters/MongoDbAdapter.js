const {MongoClient} = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
const User = require('../models/User');
const {UserUpdateModel} = require('../models/User');
const Log = require('../models/Log');
const Collection = require('../consts/InfrastructureConsts');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });


class MongoAdapter{
    constructor(url, dbName)
    {
        this.url = url;
        this.dbName = dbName;
        this.client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
    }

    async connect(){
        try{
            await this.client.connect();

            console.log(`[INFO] Connection is established.`);

            return true;
            
        } catch(err){
            console.error(`[ERROR] Connection could not be established. Error message: ${err}`);

            return false;
        }

    }

    async close(){
        try{

            console.log('[INFO] Closing the connection.');
            await this.client.close();

        } catch(err){
            console.error(`[ERROR] Error occured while closing the connection. Error message: ${err}`);
        }
    }

    isConnected(){
        return this.client.topology.isConnected();
    }

    getCollection(collectionName)
    {
        if(this.isConnected()){
            return this.client.db(this.dbName).collection(collectionName);
        } else{
            console.error('[ERROR] Database connection is not established.');
            return null;
        }
    }

    async insertOne(entity, collectionName)
    {
        try
        {    
            if(this.isConnected())
            {
                const collection = this.getCollection(collectionName);
                if(!collection) return;

                const result = await collection.insertOne(entity);

                console.log(`[INFO] A document has succesfully been inserted with the Id of ${result.insertedId}`);
            }
        }
        catch(err)
        {
            console.error(`[ERROR] An error occurred whilst trying to insert a record. Error Message: ${err}`);
        }
        
    }

    async updateOne(user, collectionName)
    {
        try{
            if(this.isConnected())
            {
                const collection = this.getCollection(collectionName);
                if(!collection) return;
    
                const id = new ObjectId(user.id);
    
               user = user.toObject();
                
                delete user.id;
                delete user._id;
    
                const result = await collection.updateOne({_id: id}, {$set: user});
    
                if(result.modifiedCount > 0)
                    console.log('[INFO] Record has been succesfully updated.');
            }
        } catch(err){
            console.error(`[ERROR] Error occurred whilst trying to update a record with the Id of: ${updateModel.id}. Error message: ${err}`);
        }
    }
    async removeOne(id, collectionName)
    {
        if(!(id instanceof ObjectId))
            id = new ObjectId(id);

        if(this.isConnected())
        {
            const collection = this.getCollection(collectionName);
            await collection.deleteOne({_id : id});

            console.log(`[INFO] A document has been deleted with the Id of: ${id}.`);
        }
        
    }

    async removeOneByDiscordId(discordId, collectionName)
    {
        if(this.isConnected())
        {
            const collection = this.getCollection(collectionName);
            await collection.deleteOne({discordUserId:discordId});

            console.log(`[INFO] A document has been deleted with the Id of: ${id}.`);
        }
        
    }
    async getOne(id, collectionName)
    {   
        if(!(id instanceof ObjectId))
            id = new ObjectId(id);
    
        if(this.isConnected())
        {
            const collection = this.getCollection(collectionName);
            const result = await collection.findOne({_id:id});

            const user = new User(result);
            return result;
        }        
    }

    async getOneByDiscordId(discordId, collectionName)
    {
        if(this.isConnected())
        {
            const collection = this.getCollection(collectionName);
            const result = await collection.findOne({discordUserId:discordId});

            const user = new User(result);        
            return user;
        }
    }   

    async getAll(collectionName)
    {
        if(this.isConnected())
        {
            const collection = this.getCollection(collectionName);
            const result = await collection.find().toArray();

            return result;
        }
        
        
    }

    async getFilteredByCustomQuery(customQuery, collectionName)
    {

    }
    
}

module.exports = MongoAdapter;

