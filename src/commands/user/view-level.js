const {SlashCommandBuilder} = require('@discordjs/builders');
const UserRepository = require('../../repository/user-repository.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Shows level by user.'),
    async execute(interaction) {
        const discordId = interaction.user.id;
        
        const userRepository = new UserRepository();

        let response = await userRepository.getExperience(discordId);

        await interaction.reply(`Level of the user is: ${response.level} and the experience is ${response.experience}`);
    },
};