const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const {REST, Routes, Events, Client, GatewayIntentBits, Collection} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

console.log(`foldersPath: ${foldersPath} commandFolders: ${commandFolders}`);

for (const folder of commandFolders)
{
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    console.log(`commandsPath: ${commandsPath} commandFiles: ${commandFiles}`);

    for(const file of commandFiles)
    {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        console.log(`filePath: ${filePath} command: ${command}`);

        if('data' in command && 'execute' in command)
            client.commands.set(command.data.name, command);
            
        
        else
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);

        console.log(client.commands);
    }

}


client.on(Events.InteractionCreate, async interaction => 
    {
        if(!interaction.isChatInputCommand()) 
            return;

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command)
        {
            console.error(`[ERROR] Command ${interaction.commandName} not found.`);      
            return;
        }

        
        try 
        {
            await command.execute(interaction);
        }
        catch (error)
        {
            console.error(`[ERROR] Failed to execute command ${interaction.commandName}.`);
            console.error(error);

            if(interaction.deferred || interaction.replied)
            {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            }
 
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }


    );
































// const commands = [
//     {
//         name: 'ping',
//         description: 'Replies with Pong!!!'
//     },
// ];

// const register = async () => {
//     const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

//     try {
//         console.log('Started refreshing application (/) commands.');

//         const res = await rest.get(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });

//         console.log('Successfully reloaded application (/) commands.');
//         console.log(res);
//     } catch (error) {
//         console.error(error);
//     }
// };

// client.on('ready', () => {
//     console.log(`Logged in as ${client.user.tag}!`);
// });

// client.on('interactionCreate', async interaction => {
//     if(!interaction.isChatInputCommand()) return;

//     if(interaction.commandName === 'ping') {
//         await interaction.reply('Pong!');
//     }
// });

// //register();

// client.login(process.env.DISCORD_TOKEN);
