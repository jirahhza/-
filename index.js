const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType 
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const TOKEN = process.env.TOKEN; // توكن البوت من Environment Variable على Railway

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  // فتح تيكت
  if (interaction.customId === 'open_ticket') {
    const existing = interaction.guild.channels.cache.find(
      c => c.name === `ticket-${interaction.user.id}`
    );
    if (existing) return interaction.reply({ content: "❌ لديك تيكت مفتوح بالفعل!", ephemeral: true });

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.id}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: ['ViewChannel'] },
        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] },
      ],
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('إغلاق التيكت')
        .setStyle(ButtonStyle.Danger)
    );

    channel.send({ content: `أهلاً <@${interaction.user.id}>!`, components: [row] });
    interaction.reply({ content: `✅ تم فتح التيكت: ${channel}`, ephemeral: true });
  }

  // غلق تيكت
  if (interaction.customId === 'close_ticket') {
    if (!interaction.channel.name.startsWith('ticket-')) 
      return interaction.reply({ content: "❌ هذه ليست قناة تيكت!", ephemeral: true });

    await interaction.reply({ content: "⏳ سيتم حذف التيكت خلال 5 ثواني..." });
    setTimeout(() => interaction.channel.delete(), 5000);
  }
});

// لوحة البوت / تيكت بانل
client.on('messageCreate', async message => {
  if (message.content === '/panel') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('افتح تيكت')
        .setStyle(ButtonStyle.Primary)
    );

    message.channel.send({ content: 'اضغط على الزر لفتح تيكت', components: [row] });
  }
});

client.login(TOKEN);
