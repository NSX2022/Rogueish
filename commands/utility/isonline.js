const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('online')
        .setDescription('Replies with bot\'s latency'),
    async execute(interaction) {
        const ping = Date.now() - interaction.createdTimestamp;
        const wsping = interaction.client.ws.ping;

        await interaction.reply(`Bot is online\n**Response Time:** ${ping} ms \n**WebSocket Ping:** ${wsping} ms`);
    },
};