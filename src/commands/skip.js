const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Var olan müziği atlamanı sağlar.'),
	async execute(interaction) {

		/* Checking if the bot is connected. If it isn't, return. */
        const isConnected = await music.isConnected({
            interaction: interaction
        });
        if(!isConnected) return interaction.reply({ content: 'Zaten çalan bir müzik yok', ephemeral: true });

        /* Get more info about how the skip command works at https://npmjs.com/package/@koenie06/discord.js-music#skip */
        music.skip({
            interaction: interaction
        });

        interaction.reply({ content: `Şarkı başarıyla geçildi.` });

	},
};