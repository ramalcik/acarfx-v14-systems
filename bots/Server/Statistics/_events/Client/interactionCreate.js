const { Message, EmbedBuilder } = require("discord.js");

/**
 * @param {import("discord.js").Interaction} interaction
 */
module.exports = async (interaction) => { 
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: true }).catch(() => {});

        const cmd = client.slashcommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "Komut bulunamadı!" });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args);
    }

    if (interaction.isContextMenuCommand()) {
        await interaction.deferReply({ ephemeral: true });
        const command = client.slashcommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }

};

module.exports.config = {
    Event: "interactionCreate"
};
