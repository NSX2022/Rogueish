const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('online?')
        .setDescription('Replies, if the bot is online'),
    async execute(interaction) {
        await interaction.reply('Received command');
    },
};