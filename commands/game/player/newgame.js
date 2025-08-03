const { SlashCommandBuilder } = require('discord.js');

//TODO exec() the initialization process for the actual game

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newgame')
        .setDescription('Erases player data and starts a new game'),
    async execute(interaction) {
        //TODO
        await interaction.reply(`TODO add this`);
    }
};
