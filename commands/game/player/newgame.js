//TODO exec() the initialization process for the actual game

const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newgame')
        .setDescription('Start a new game'),

    async execute(interaction) {

        const nameModal = new ModalBuilder()
            .setTitle('Get Name')
            .setCustomId('getPlayerName');

        const nameInput = new TextInputBuilder()
            .setCustomId('nameInput')
            .setLabel("What is your name?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(nameInput);

        nameModal.addComponents(actionRow);

        await interaction.showModal(nameModal);
    },
};