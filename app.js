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
    let text = await interaction.options.getString('text');
    if (!prompt){
      prompt = "devious, whimsical, comical, and loves tomfoolery"
    }

    (async () => {
      const response = await openai.createCompletion("text-davinci-002", {
        prompt: "The following is a conversation with someome who has the characteristics of, "+prompt+".\n\nUser: Hello, who are you?\nBot: I am a Discord bot. How can I help you today?\nUser: "+text+'.',
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" User:", " Bot:"],
      });
      if (response.data.choices[0].text.length === 0) { // TODO: if the response only contains newlines, then reply with a random response
        msg.reply("I'm sorry, I don't understand what you're saying.");
        console.error('OpenAI API returned an empty response.');
        return;
      }
      console.log(response.data.choices[0]);
      let responseText = response.data.choices[0].text.replace(/Bot:/g, " ").replace(/\n/g, " "); // TODO: only get text after "AI:"
      interaction.reply(responseText);
    })();


  }

});



client.login(process.env.DISCORD_TOKEN);