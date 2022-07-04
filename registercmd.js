const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('talk').setDescription('Interact with the AI').addStringOption(option => option.setName('text').setRequired(true).setDescription('The text to give the AI')).addStringOption(option => option.setName('prompt').setDescription('A short description of how the AI should behave.')),
    new SlashCommandBuilder().setName('code').setDescription('Generate code from the AI').addStringOption(option => option.setName('prompt').setRequired(true).setDescription('The code the AI will generate')),

]
.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENTID, process.env.DISCORD_SERVERID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);