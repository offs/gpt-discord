const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('talk').setDescription('Interact with the AI').addStringOption(option => option.setName('prompt').setRequired(true).setDescription('A short description of how the AI should behave.')).addStringOption(option => option.setName('text').setRequired(true).setDescription('The text to give the AI'))
]
.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENTID, process.env.DISCORD_SERVERID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);