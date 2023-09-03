const { Events } = require('discord.js');
const UserRepository = require('../repository/UserRepository');

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
		const discordId = interaction.author.id;
        const letterCount = interaction.content.length;

        const userRepository = new UserRepository();
        await userRepository.addExperience(discordId, letterCount);
	},
};