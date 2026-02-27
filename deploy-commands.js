const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1467995082262188236';
const GUILD_ID = '1314896957432402022';

const commands = [
  new SlashCommandBuilder()
    .setName('panel')
    .setDescription('يعرض بانل التيكت')
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('⌛ تسجيل الأوامر...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ تم تسجيل الأمر /panel بنجاح!');
  } catch (error) {
    console.error(error);
  }
})();
