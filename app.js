const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING] });

require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

client.once('ready', () => {
	console.log('Ready to start chatting!');
});


client.on('messageCreate', async msg => {
  if (msg.author.bot) return; // filtering bad messages
  if (msg.channel.type === 'dm') return;
  if (msg.content.length > 500) return;
  if (msg.content.length === 0) return;
  if (msg.attachments.size !== 0) return;
  if (!msg.content.startsWith('<@973207846969806868>')) return;

  let userprompt = msg.content.replace(/<@973207846969806868>/g, '').trim();
  console.log(`User ${msg.author.username}'s prompt: ${userprompt}`);

  (async () => {
    const response = await openai.createCompletion("text-davinci-002", {
      prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: "+userprompt+'.',
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });
    if (response.data.choices[0].text.length === 0) {
      msg.reply("I'm sorry, I don't understand what you're saying.");
      console.error('OpenAI API returned an empty response.');
      return;
    }
    console.log(response.data.choices[0]);
    let responseText = response.data.choices[0].text.replace(/AI:/g, "").replace(/\n/g, "");
    msg.reply(responseText);
  })();
});


client.login(process.env.DISCORD_TOKEN);