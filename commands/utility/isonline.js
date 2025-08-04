const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('online')
        .setDescription('Replies with bot\'s latency'),
    async execute(interaction) {
        const startTime = Date.now();

        await interaction.reply('Pinging...');

        const endTime = Date.now();
        const processingTime = endTime - startTime;

        const wsping = interaction.client.ws.ping;
        let wspingText;

        if (wsping === -1 || wsping === null || wsping === undefined) {
            wspingText = 'Not available';
        } else {
            wspingText = `${wsping}ms`;
        }

        await interaction.editReply(
            `Rogueish is online \n` +
            `**Response Time:** ${processingTime}ms\n`/* +
            `**WebSocket Ping:** ${wspingText} ms`
            */
        );
    },
};