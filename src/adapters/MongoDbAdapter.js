const {MongoClient} = require('mongodb');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DBNAME;

const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

// async function main()
// {
//     const url = process.env.MONGODB_URL;
//     const dbName = process.env.MONGODB_DBNAME;
    
//     const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
    
//     try
//     {
//         await client.connect();
//         console.log('Connected to MongoDb');
    
//         const db = client.db(dbName);
//         const collection = db.collection('user');
    
//         const user = new User({name:'Cenkay', discordUserId:'-', email:'test@gmail.com',experience:1,level:1,password:'strongpass'});
    
//         var result = await collection.insertOne(user);
    
//         console.log('Document inserted', result.insertedId);
//     }
//     catch(err)
//     {
//     console.error('Error',err);
//     }
//     finally
//     {
//     client.close();
//     }
// }

//main();


async function openConnection(collectionName)
{
    try{
        await client.connect();
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
    
        const existingCollectionNames = collections.map((collection) => collection.name);
    
        if(!existingCollectionNames.includes(collectionName))
        {
            console.error(`[ERROR] Collection with name: ${collectionName} doesn't exist in the database.`);
            await client.close();
            return;
        }

        const isConnected = client.topology.isConnected();
        if(isConnected)
        {
            console.log(`[INFO] Connection is established to collection: ${collectionName}`);
        }   
    }
    catch(err){
        console.error(`[ERROR] Connection could not be established. Error Message: ${err}`);
        await client.close();
    }
}

async function closeConnection()
{
    try{
        const isConnected = client.topology.isConnected();

        if(isConnected)
        {
            const db = client.db(dbName);
            const result = await db.command({currentOp: true});

            const transactions = await result.inprog.filter((op) => op.txnNumber !== undefined);

            if(transactions.length > 0)
            {
                let transactionsCount = transactions.length;

                while(transactionsCount === 0)
                {
                    console.log(`[INFO] There are still open transactions left. Open transactions count: ${transactions.length}. Trying again in 3 seconds to finish up the transactions.`);

                    setTimeout(()=>{
                        let result = db.command({currentOp: true});
                        let transactions = result.inprog.filter((op) => op.txnNumber !== undefined);
    
                        transactionsCount = transactions.length;
                    },3000);
                }
            }

            console.log(`[INFO] Closing the connection.`);
        }
    }
    catch(err){
        console.error(`[ERROR] Error occured while checking the connection status. Error Message: ${err}`);
    }
    finally{
        await client.close();
    }
}

async function waitForOpenTransactions(dbName)
{
    
}

(async()=>{
await openConnection('user');
await closeConnection();
}
)();


