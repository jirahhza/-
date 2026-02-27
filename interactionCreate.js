const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");
const fs = require("fs");

module.exports = client => {
  client.on("interactionCreate", async interaction => {
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return;
      await cmd.execute(interaction);
    }

    if (!interaction.isButton()) return;

    // فتح تيكت
    if (interaction.customId === "open_ticket") {
      // منع فتح أكثر من تيكت
      if (
        interaction.guild.channels.cache.find(
          c => c.name === `ticket-${interaction.user.id}`
        )
      )
        return interaction.reply({
          content: "❌ لديك تذكرة مفتوحة بالفعل!",
          ephemeral: true
        });

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.id}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel]
          }
        ]
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close_ticket")
          .setLabel("🔒 إغلاق التيكت")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("transcript_ticket")
          .setLabel("📄 ترانسكريبت")
          .setStyle(ButtonStyle.Secondary)
      );

      channel.send({
        content: `أهلاً <@${interaction.user.id}>!`,
        components: [row]
      });

      interaction.reply({
        content: `✅ تم فتح التذكرة: ${channel}`,
        ephemeral: true
      });
    }

    // غلق تيكت
    if (interaction.customId === "close_ticket") {
      if (!interaction.channel.name.startsWith("ticket-"))
        return interaction.reply({
          content: "❌ هذه ليست قناة تذكرة!",
          ephemeral: true
        });

      interaction.reply({ content: "🔒 سيتم حذف التذكرة بعد 5 ثواني..." });
      setTimeout(() => interaction.channel.delete(), 5000);
    }

    // ترانسكريبت
    if (interaction.customId === "transcript_ticket") {
      if (!interaction.channel.name.startsWith("ticket-"))
        return interaction.reply({
          content: "❌ هذه ليست قناة تذكرة!",
          ephemeral: true
        });

      const messages = await interaction.channel.messages.fetch();
      const txt = messages
        .map(m => `${m.author.tag}: ${m.content}`)
        .reverse()
        .join("\n");

      const filename = `${interaction.channel.name}.txt`;
      fs.writeFileSync(filename, txt);

      await interaction.reply({
        content: "📄 تم حفظ الترانسكريبت!",
        files: [filename],
        ephemeral: true
      });

      fs.unlinkSync(filename);
    }
  });
};
