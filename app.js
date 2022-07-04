const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_PRESENCES] });

require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

client.once('ready', () => {
	console.log('Ready to start chatting!');
  client.user.setPresence({ activities: [{ name: 'https://github.com/offs/gpt-discord/' }], status: 'idle' });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'talk') {
    let prompt = await interaction.options.getString('prompt');
    if (!prompt) prompt = "devious, whimsical, comical, and loves tomfoolery";
    let text = await interaction.options.getString('text');

    await interaction.reply('I am thinking...');

    (async () => {
      const response = await openai.createCompletion("text-davinci-002", {
        prompt: "The following is a conversation with someome who has the characteristics of, "+prompt+".\n\nUser: Hello, who are you?\nBot: I am a Discord bot. How can I help you today?\nUser: "+text+'.\n',
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" User:", " Bot:"],
      });
      console.log(response.data.choices);
      let responseText = response.data.choices[0].text.replace(/Bot:|User:|\n/g, "");
      if (responseText === "") responseText = "I am not sure what you are trying to say.";
      try {
        interaction.editReply(responseText);
      } catch (e) {
        interaction.editReply('An error occurred');
      }
        
    })();
  }

  if (interaction.commandName === 'code') {
    let prompt = await interaction.options.getString('prompt');
    await interaction.reply('I am thinking...');
    (async () => {
      const response = await openai.createCompletion("code-davinci-002", {
        prompt: '/*'+prompt+': */\n\n',
        temperature: 0,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0.3,
        presence_penalty: 0,
        stop: ["\n\n\n"]
      });
      let responseText = response.data.choices[0].text.replace(/`/g, "");
      //if there is a + at beginning of a line, remove it
      responseText = responseText.replace(/^\+/gm, "");
      // if longer than 2000 characters, edit the reply saying its too long
      if (responseText.length > 2000) {
        interaction.editReply('The code is too long to send.');
      }
      try {
        interaction.editReply('```'+responseText+'```');
      }catch (e) {
        interaction.editReply('An error occurred');
      }
    }
    )();
  }

});



client.login(process.env.DISCORD_TOKEN);