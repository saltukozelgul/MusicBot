const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const music = require('@koenie06/discord.js-music');
const yts = require( 'yt-search' )
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('musicplayer')
		.setDescription('Müzik playerı açmanı sağlar.'),
	async execute(interaction) {

    //Creating button object to select music name
    const button1 = new MessageButton()
      .setCustomId('resume')
      .setLabel('')
      .setStyle('SECONDARY')
      .setEmoji('▶️');
    const button2 = new MessageButton()
      .setCustomId('stop')
      .setLabel('')
      .setStyle('SECONDARY')
      .setEmoji('⏹');
    const button3 = new MessageButton()
      .setCustomId('skip')
      .setLabel('')
      .setStyle('SECONDARY')
      .setEmoji('⏭');
    const button4 = new MessageButton()
      .setCustomId('pause')
      .setLabel('')
      .setStyle('SECONDARY')
      .setEmoji('⏸');
    const button5 = new MessageButton()
      .setCustomId('repeat')
      .setLabel('')
      .setStyle('SECONDARY')
      .setEmoji('🔄');


    //Creating a row with buttons
    const row = new MessageActionRow()
			.addComponents(
        button1,button4,button2,button3,button5
			);


    //Creating discord embed and sending it to channel with buttons.
    const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('♫ NBS Asistan Müzik Çalar ♫')
      .setDescription(`Şarkıyı kontrol etmek için butonları kullanabilirsin!`)
      .addField('Devam Ettirme:', "▶️", true)
      .addField('Durdur', "⏹", true)
      .addField('Sonraki Şarkı', "⏭", true)
      .addField('Duraklat', "⏸", true)
      .addField('Çalan şarkıyı tekrar ettir.', "🔄", true)
      .setThumbnail('https://i.hizliresim.com/afe9gdv.png')
      .setFooter("musical system coded by saltuk")
		await interaction.reply({ content:" ", ephemeral: true, embeds: [embed], components: [row] });



    //Collecting buttons
    const filter = i => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter });

    collector.on('collect', async i => {
      if (i.customId === 'pause') {
        /* Checking if the bot is connected. If it isn't, return. */
        const isConnected = await music.isConnected({
            interaction: interaction
        });
        if(!isConnected) return interaction.editReply({ content: 'Halihazırda çalan bir şarkı yok.' });
        const isPaused = await music.isPaused({
            interaction: interaction
        });
        if(isPaused) return interaction.editReply({ content: 'Şarkı zaten durdurulmuş' });

        await i.deferUpdate();
        await wait(2000);
        await i.editReply({ content: '**Şarkı duraklatıldı.**' });

        music.pause({
            interaction: interaction
        });
      }
      else if (i.customId === 'resume') {
        /* Checking if the bot is connected. If it isn't, return. */
        const isConnected = await music.isConnected({
            interaction: interaction
        });
        if(!isConnected) return interaction.editReply({ content: 'Çalan bir şarkı yok' });

        const isResumed = await music.isResumed({
            interaction: interaction
        });
        if(isResumed) return interaction.editReply({ content: 'Şarkı zaten çalıyor.'});

        await i.deferUpdate();
        await wait(2000);
        await i.editReply({ content: '**Şarkı devam ettirildi.**' });

        music.resume({
            interaction: interaction
        });

      }
      else if (i.customId === 'stop') {
        /* Checking if the bot is connected. If it isn't, return. */
            const isConnected = await music.isConnected({
                interaction: interaction
            });
            if(!isConnected) return interaction.editReply({ content: 'Halihazırda bir kanalda çalmıyorum.'});

        /* Checking if there is music playing or not. If there isn't, return. */
        const queue = music.getQueue({
          interaction: interaction
        });
        if(queue.length === 0) return interaction.editReply({ content: 'Aktif olarak çalan bir müzik yok.' });

        await i.deferUpdate();
        await wait(1000);
        await i.editReply({ content: '**Şarkı kapatıldı.**' });

          music.stop({
              interaction: interaction
          });
      }
      else if (i.customId === 'skip') {
          const isConnected = await music.isConnected({
              interaction: interaction
          });
          if(!isConnected) return interaction.editReply({ content: 'Zaten çalan bir müzik yok' });

          await i.deferUpdate();
          await wait(1000);
          await i.editReply({ content: '**Sonraki şarkıya geçildi.**' });

          music.skip({
              interaction: interaction
          });
      }
      else if (i.customId === 'repeat') {
        
        var boolean = false;

        /* Checking if the bot is connected. If it isn't, return. */
        const isConnected = await music.isConnected({
            interaction: interaction
        });
        if(!isConnected) return interaction.editReply({ content: 'There are no songs playing', ephemeral: true });
        var onoff = " ";

        /* Checking if the music is already repeated. If it is, return. */
        const isRepeated = await music.isRepeated({
            interaction: interaction
        });

        if (isRepeated) {
          boolean = false;
          onoff = "kapalı";
        }else {
          boolean = true;
          onoff = "açık";
        }

        if(isRepeated === boolean) return interaction.editReply({ content: `Repeat mode is already on ${boolean}`});

        music.repeat({
            interaction: interaction,
            value: boolean
        });

        await i.deferUpdate();
        await wait(1000);
        await i.editReply({ content: `Tekrarlama modu: **${onoff}**` });
      }
    });

    collector.on('end', collected => {
        console.log("Bakmayı bıraktım.")
      });
      
      },
};