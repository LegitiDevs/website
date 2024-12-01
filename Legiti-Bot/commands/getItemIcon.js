const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

async function getItemIcon(item_id) {
  let final = item_id.replace(/^\w+:/, "").split("_");
  final = final
      .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
      .join("_");

  const pngUrl = `https://minecraft.wiki/w/Special:FilePath/${final}.png`;
  const pngResponse = await fetch(pngUrl);

  if (pngResponse.ok) {
      return pngResponse.url;
  }

  const gifUrl = `https://minecraft.wiki/w/Special:FilePath/${final}.gif`;
  const gifResponse = await fetch(gifUrl);

  if (gifResponse.ok) {
      return gifResponse.url;
  }

  throw new SyntaxError(`'${item_id}' is not a valid item id.`);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getitemicon")
    .setDescription("Get an item's icon")
    .addStringOption((option) =>
      option.setName("item").setDescription("The item").setRequired(true)
    ),
  async execute(interaction) {
    try {
      let icon = await getItemIcon(interaction.options.getString("item"));
      const itemEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Item Icon")
        .setImage(icon);
      await interaction.reply({ embeds: [itemEmbed] });
    } catch (error) {
      await interaction.reply(`${error.message}`);
    }
  },
};
