const { REST, Routes } = require('discord.js');
require('dotenv').config({ path: './config.env' });
const CLIENT_ID = process.env.CLIENT_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

// Recursive function to load commands from all subdirectories
function loadCommandsRecursively(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            // If it's a directory, recurse into it
            loadCommandsRecursively(fullPath);
        } else if (item.endsWith('.js')) {
            // If it's a .js file, try to load it as a command
            try {
                const command = require(fullPath);
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                    console.log(`Loaded command: ${command.data.name} from ${fullPath}`);
                } else {
                    console.log(`[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`);
                }
            } catch (error) {
                console.error(`Error loading ${fullPath}:`, error.message);
            }
        }
    }
}

// Start loading from the commands directory
const commandsPath = path.join(__dirname, 'commands');
loadCommandsRecursively(commandsPath);

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(DISCORD_TOKEN);

// Deploy your commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();