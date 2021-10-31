const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Adını verdiğiniz şarkıyı çalar')
        .addStringOption(string => 
            string
                .setName('song')
                .setDescription('Verilen şarkıyı olduğunuz kanalda çalar')
                .setRequired(true)),
	async execute(interaction) {
		
        /* This will get the song that has been provided */
        const song = interaction.options.getString('song');

        /* Gets the voice channel where the member is in. If the member isn't in any, return. */
        const voiceChannel = interaction.member.voice.channel;
        if(!voiceChannel) return interaction.reply({ content: 'Bir sesli kanalda olmanız gerekli!', ephemeral: true });

        /* Get more info about how the play command works at https://npmjs.com/package/@koenie06/discord.js-music#play */
        music.play({
            interaction: interaction,
            channel: voiceChannel,
            song: song
        });

        await interaction.deferReply();
        await wait(2000);
        await interaction.editReply('Sanırım aradığın şeyi buldum.');
	},
};