const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // ID البوت
const GUILD_ID = process.env.GUILD_ID;   // ID السيرفر

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // تسجيل أمر /panel تلقائي
  const commands = [
    new SlashCommandBuilder().setName("panel").setDescription("يعرض بانل التيكت").toJSON()
  ];

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ تم تسجيل أمر /panel تلقائياً!");
  } catch (err) {
    console.error("❌ خطأ في تسجيل الأوامر:", err);
  }
});

client.login(TOKEN);
