// Require the necessary discord.js classes
const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config({ path: './config.env' });
const { Client, Events, GatewayIntentBits, Activity, ActivityType, MessageFlags, Collection} = require('discord.js');
const token = process.env.DISCORD_TOKEN;

console.log('Token loaded:', token ? 'Yes' : 'No');
console.log('All env vars:', Object.keys(process.env));

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

//load commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}



// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

const activities = ['Spelunking', 'Dungeon Diving', 'Casting Spells', 'Slaying Goblins',
'Levelling Up', 'Equipping Armor'];
let randomActivity = activities[Math.floor(Math.random() * activities.length)];

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
});

// Log in to Discord with your client's token
client.login(token).then(() => {
    client.user.setActivity(randomActivity, { type: ActivityType.Custom });
});

setInterval(() => {
    let randomActivity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(randomActivity);
}, 600000);