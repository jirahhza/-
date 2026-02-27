const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel]
});

client.config = require("./config.json");
client.commands = new Collection();

// load commands
fs.readdirSync("./commands").forEach(file => {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
});

// load events
fs.readdirSync("./events").forEach(file => {
  require(`./events/${file}`)(client);
});

client.login(client.config.TOKEN);
