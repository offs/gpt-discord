const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING] });

require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

client.once('ready', () => {
	console.log('yoooooo');
});


client.on('messageCreate', async msg => {
  console.log(msg.content);
    if (msg.author.bot) return;
    if (msg.channel.type === 'dm') return;
    if (msg.attachments.size !== 0) return;

    console.log(`User ${msg.author.username}'s prompt: ${msg.content}`);

    try {
      const completion = await openai.createCompletion("text-davinci-002", {
        prompt: 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. Human: Hello, who are you? AI: I am an AI created by OpenAI. How can I help you today? Human: ' + msg.content,
      });
      let response = completion.data.choices[0].text;
      if (!response) { return; }
      response.replace(/\n/g, '');
      response.replace('AI: ', '');
      console.log(response);
      msg.channel.send(response);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
});


client.login(process.env.DISCORD_TOKEN);