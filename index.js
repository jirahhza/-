const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // ضع ID البوت
const GUILD_ID = process.env.GUILD_ID;   // ضع ID السيرفر

// تسجيل أمر /panel تلقائي
(async () => {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: [new SlashCommandBuilder().setName('panel').setDescription('يعرض بانل التيكت').toJSON()] }
    );
    console.log('✅ تم تسجيل الأمر /panel!');
  } catch (err) {
    console.error(err);
  }
})();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  // أوامر سلاش
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'panel') {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('open_ticket')
          .setLabel('افتح تيكت')
          .setStyle(ButtonStyle.Primary)
      );
      await interaction.reply({ content: 'اضغط على الزر لفتح تيكت', components: [row], ephemeral: true });
    }
  }

  // أزرار التيكت
  if (interaction.isButton()) {
    // فتح تيكت
    if (interaction.customId === 'open_ticket') {
      const existing = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
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
  }
});

client.login(TOKEN);
