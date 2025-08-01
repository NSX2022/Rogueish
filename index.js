// Require the necessary discord.js classes
require('dotenv').config({ path: './config.env' });
const { Client, Events, GatewayIntentBits } = require('discord.js');
const token = process.env.DISCORD_TOKEN;

console.log('Token loaded:', token ? 'Yes' : 'No');
console.log('All env vars:', Object.keys(process.env).filter(key => key.startsWith('DISCORD')));

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
