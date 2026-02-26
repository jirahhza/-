require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  Events
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// أمر إرسال لوحة الرتب
client.on("interactionCreate", async interaction => {

  // زر الرتب
  if (interaction.isButton()) {
    const role = interaction.guild.roles.cache.find(r => r.name === interaction.customId);

    if (!role) return interaction.reply({ content: "❌ الرتبة غير موجودة", ephemeral: true });

    await interaction.member.roles.add(role);
    await interaction.reply({ content: `✅ تم إعطائك رتبة ${role.name}`, ephemeral: true });
  }

  // قائمة الألوان
  if (interaction.isStringSelectMenu()) {
    const role = interaction.guild.roles.cache.find(r => r.name === interaction.values[0]);

    if (!role) return interaction.reply({ content: "❌ اللون غير موجود", ephemeral: true });

    await interaction.member.roles.add(role);
    await interaction.reply({ content: `🎨 تم اختيار لون ${role.name}`, ephemeral: true });
  }
});

// أمر سلاش لإنشاء اللوحة
client.on("ready", async () => {
  const data = [{
    name: "panel",
    description: "إرسال لوحة الرتب"
  }];

  await client.application.commands.set(data);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "panel") {

    const buttons = new ActionRowBuilder();

    for (let i = 1; i <= 10; i++) {
      buttons.addComponents(
        new ButtonBuilder()
          .setCustomId(`${i}`)
          .setLabel(`${i}`)
          .setStyle(ButtonStyle.Primary)
      );
    }

    const colors = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("colors")
        .setPlaceholder("اختر لونك")
        .addOptions([
          { label: "Red", value: "Red" },
          { label: "Blue", value: "Blue" },
          { label: "Green", value: "Green" }
        ])
    );

    await interaction.reply({
      content: "🎭 اختر مستواك أو لونك:",
      components: [buttons, colors]
    });
  }
});

client.login(process.env.TOKEN);
