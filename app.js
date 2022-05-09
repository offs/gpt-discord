const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.channel.type === 'dm') return;
    if (msg.attachments.size !== 0) return;

    console.log(`User, ${msg.author.username}'s prompt: ${msg.content}`);
    msg.channel.startTyping();

});


client.login();