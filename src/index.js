const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Routes, REST, Client, Collection, GatewayIntentBits,SlashCommandBuilder } = require('discord.js');


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
console.log(client.commands);

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async() => {
    try
    {
        console.log(`Started refreshing ${client.commands.length} application (/) commands.`);
        //put method is used to fully refresh all commands in the guild with the current set

		const commandsJson = [];
		var commandsArray = Array.from(client.commands.values()).reduce((x, obj) => {
			x.push(obj.data);
			return x;
		}, []).forEach(function(obj)
		{
			commandsJson.push(obj);
		});

        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            {body: commandsJson},
        );
    }
    catch(error)
    {
        console.error(error);
    }
} 
)();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) 
	{
		client.once(event.name, async(interaction) => event.execute(interaction));
	} 
	else 
	{
		client.on(event.name, async(interaction) => event.execute(interaction));
	}	
}



client.login(process.env.DISCORD_TOKEN);

