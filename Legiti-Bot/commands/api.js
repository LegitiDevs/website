const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("api").setDescription("Api command"),
  async execute(interaction) {
    try {
      const apiEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Api")
        .setDescription("this is the api command");
      await interaction.reply({ embeds: [apiEmbed] });
    } catch (error) {
      await interaction.reply(`${error}`);
    }
  },
};
