const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('فتح تذكرة دعم')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        'CLIENT_ID_هنا',
        'GUILD_ID_هنا'
      ),
      { body: commands }
    );

    console.log('Slash command registered');
  } catch (error) {
    console.error(error);
  }
})();
