const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Çalan şarkıyı duraklatır.'),
	async execute(interaction) {

        /* Checking if the bot is connected. If it isn't, return. */
        const isConnected = await music.isConnected({
            interaction: interaction
        });
        if(!isConnected) return interaction.reply({ content: 'Halihazırda çalan bir şarkı yok.', ephemeral: true });

        /* Checking if the music is already paused. If it is, return. */
        const isPaused = await music.isPaused({
            interaction: interaction
        });
        if(isPaused) return interaction.channel.send({ content: 'Şarkı zaten durdurulmuş', ephemeral: true });

        music.pause({
            interaction: interaction
        });

        interaction.reply({ content: `Şarkı durduruldu.` });

	},
};