const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const {REST, Routes, Client, GatewayIntentBits} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if('data' in command && 'execute' in command)
    {
        client.commands.set(command.data.name, command);
        console.log(`Loaded command ${command.data.name} from ${filePath}`);
    }
    else
    {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }

}

































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
