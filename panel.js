const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("عرض بانل نظام التيكت"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("📩 افتح تيكت")
        .setStyle(ButtonStyle.Success)
    );

    await interaction.reply({
      content: "اضغط على الزر لفتح تذكرتك:",
      components: [row],
      ephemeral: true
    });
  }
};
