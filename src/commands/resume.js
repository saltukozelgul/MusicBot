const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Durdurulan müziği tekrar başlatır.'),
	async execute(interaction) {

        /* Checking if the bot is connected. If it isn't, return. */
        const isConnected = await music.isConnected({
            interaction: interaction
        });
        if(!isConnected) return interaction.reply({ content: 'Çalan bir şarkı yok', ephemeral: true });

        const isResumed = await music.isResumed({
            interaction: interaction
        });
        if(isResumed) return interaction.channel.send({ content: 'Şarkı zaten çalıyor.', ephemeral: true });

        music.resume({
            interaction: interaction
        });


	},
};