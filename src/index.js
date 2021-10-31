// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const keepAlive = require("./server.js");
const music = require('@koenie06/discord.js-music');

//Just an embed creator func for good looking
async function embedMaker(view ,title, duration, url, thumbnail, reqBy) {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .setURL(url)
        .setThumbnail(thumbnail)
        .addField('Aldığı İzlenme', view, true)
        .addField('Uzunluk', duration, true)
        .addField('Şarkıyı açan', reqBy, true)
        .setTimestamp()
        .setFooter('NBS Asistan Müzik Sistemi');
    return embed;
}


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_VOICE_STATES] });

// Creating collection and adding commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

//Creating events collections and adding events
const eventFiles = fs.readdirSync('src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Music events
/* This will run when a new song started to play */
music.event.on('playSong', (channel, songInfo, requester) => {
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${songInfo.title}`)
        .setURL(`${songInfo.url}`)
        .setThumbnail(`${songInfo.thumbnail}`)
        .addField('Aldığı İzlenme', `${songInfo.views}`, true)
        .addField('Uzunluk', `${songInfo.duration}`, true)
        .addField('Şarkıyı açan', `${requester}`, true)
        .setTimestamp()
        .setFooter('NBS Asistan Müzik Sistemi');

	channel.send({ embeds: [embed] });
});

/* This will run when a new song has been added to the queue */
music.event.on('addSong', (channel, songInfo, requester) => {
        const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${songInfo.title}`)
        .setURL(`${songInfo.url}`)
        .setThumbnail(`${songInfo.thumbnail}`)
        .setDescription("Şarkı sıraya başarıyla eklendi.")
        .setTimestamp()
        .setFooter('NBS Asistan Müzik Sistemi');
	channel.send({ embeds: [embed] });
});

/* This will run when a song started playing from a playlist */
music.event.on('playList', async (channel, playlist, songInfo, requester) => {
    channel.send({
        content: `Şu anda çalan şarkı: [${songInfo.title}](${songInfo.url}) by \`${songInfo.author}\` Var olduğu playlist: ${playlist.title}.
        Şarkıyı Açan: ${requester.tag} (${requester.id})`
    });
});

/* This will run when a new playlist has been added to the queue */
music.event.on('addList', async (channel, playlist, requester) => {
    channel.send({
        content: `Playlist sıraya eklendi: [${playlist.title}](${playlist.url}) toplamda ${playlist.videos.length} adet şarkı sıraya eklendi..
        Ekleyen: ${requester.tag} (${requester.id})`
    });
});

/* This will run when all the music has been played, and the bot disconnects. */
music.event.on('finish', (channel) => {
	channel.send({ content: `Tüm çalacaklarımı çaldım yani şarkılarımı...` });
});

// End of Music events


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);
keepAlive();
