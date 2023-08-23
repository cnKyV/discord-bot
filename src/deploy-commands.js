const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const {REST, Routes, Events, Client, GatewayIntentBits, Collection} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds]});

const discordToken = process.env.DISCORD_TOKEN;
const discordClientId = process.env.DISCROD_CLIENT_ID;

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders)
{
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for(const file of commandFiles)
    {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if('data' in command && 'execute' in command)
            client.commands.set(command.data.name, command);
                   
        else
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST().setToken(discordToken);

(async() => {
    try
    {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        //put method is used to fully refresh all commands in the guild with the current set

        const data = await rest.put(
            Routes.applicationGuildCommands(discordClientId),
            {body: commands},
        );
    }
    catch(error)
    {
        console.error(error);
    }
}
)();