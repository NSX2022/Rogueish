// Require the necessary discord.js classes
require('dotenv').config({ path: './config.env' });
const { Client, Events, GatewayIntentBits, Activity, ActivityType} = require('discord.js');
const token = process.env.DISCORD_TOKEN;

console.log('Token loaded:', token ? 'Yes' : 'No');
console.log('All env vars:', Object.keys(process.env).filter(key => key.startsWith('DISCORD')));

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

const activities = ['Spelunking', 'Dungeon Diving', 'Casting Spells', 'Slaying Goblins',
'Levelling Up', 'Equipping Armor'];
let randomActivity = activities[Math.floor(Math.random() * activities.length)];

// Log in to Discord with your client's token
client.login(token).then(() => {
    client.user.setActivity(randomActivity, { type: ActivityType.Custom });
});



// Change activity every 10 minutes
setInterval(() => {
    let randomActivity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(randomActivity);
}, 600000);