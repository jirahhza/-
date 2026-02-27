const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField, 
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'ticket') {

      const button = new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('🎫 فتح تذكرة')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.reply({
        content: 'اضغط الزر لفتح تذكرة',
        components: [row]
      });
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'open_ticket') {

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });

      await channel.send(`مرحباً ${interaction.user} 👋\nتم فتح التذكرة.`);
      await interaction.reply({ content: 'تم إنشاء تذكرتك ✅', ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
