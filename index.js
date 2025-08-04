// Require the necessary discord.js classes
const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config({ path: './config.env' });
const { spawn, exec } = require('child_process');
const { Client, Events, GatewayIntentBits, Activity, ActivityType, MessageFlags, Collection} = require('discord.js');
const token = process.env.DISCORD_TOKEN;
const Sequelize = require('sequelize');

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

function recursiveLoading(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            // If it's a directory, recurse into it
            recursiveLoading(fullPath);
        } else if (item.endsWith('.js')) {
            // If it's a .js file, try to load it as a command
            try {
                const command = require(fullPath);
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`);
                }
            } catch (error) {
                console.error(`Error loading ${fullPath}:`, error.message);
            }
        }
    }
}

const commandsPath = path.join(__dirname, 'commands');
recursiveLoading(commandsPath);

console.log(`Loaded ${client.commands.size} commands`);

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

const activities = ['Spelunking', 'Dungeon diving', 'Casting spells', 'Slaying goblins',
'Levelling up', 'Equipping armor'];
let randomActivity = activities[Math.floor(Math.random() * activities.length)];

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()){
        const command = client.commands.get(interaction.commandName);
        if(!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true });
            }
        }
    }

    if(interaction.isModalSubmit()) {
        switch (interaction.customId){
            case 'getPlayerName':
                const playerName = interaction.fields.getTextInputValue('nameInput');

                await interaction.reply(`Enter the dungeon, ${playerName}`);
                break;
        }
    }
});

// Log in to Discord with your client's token
client.login(token).then(() => {
    client.user.setActivity(randomActivity, { type: ActivityType.Custom });
});

exec('node deploy-commands.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error}`);
        return;
    }
    console.log(`Output: ${stdout}`);
});

setInterval(() => {
    let randomActivity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(randomActivity, { type: ActivityType.Custom });
}, 600000);