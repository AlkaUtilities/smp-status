import {
    ChannelType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    SlashCommandBuilder,
    TextChannel,
} from "discord.js";

import config from "../../config";

const rules: string[] = [
    "No cheating.",
    "No duping.",
    "No lag machine(s).",
    "Griefing is allowed",
];

const Rules: string = rules
    .map((r) => `\` No. ${rules.indexOf(r) + 1} \` ${r}`)
    .join("\n\n");

module.exports = {
    name: "embed",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: true, // is command developer only?
    global: true,
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Sends embed")
        .setDMPermission(false)
        .addStringOption((str) =>
            str
                .setName("type")
                .setDescription("Embed type")
                .setRequired(true)
                .setChoices(
                    // { name: "important", value: "important" },
                    { name: "info", value: "info" },
                    { name: "rules", value: "rules" }
                )
        )
        .addChannelOption((channel) =>
            channel
                .setName("target")
                .setDescription("Channel to send embed to")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    execute(interaction: ChatInputCommandInteraction, client: Client) {
        const type = interaction.options.getString("type", true);
        const target = interaction.options.getChannel(
            "target",
            true
        ) as TextChannel;

        switch (type) {
            // case "important":
            //     {
            //         const embed = new EmbedBuilder()
            //             .setTitle("Important")
            //             .setDescription(
            //                 [
            //                     "Before joining the server, you need to install some mods first.",
            //                     "To do this, you need to have Fabric. If you don't know how to install Fabric, follow [this tutorial](https://www.youtube.com/watch?v=x7gmfib4gHg).",
            //                     "Please note, the server version is 1.19.3. Therefore, you need to install Fabric for version 1.19.3.",
            //                 ].join("\n\n")
            //             )
            //             .setColor("#dc143c");

            //         interaction.reply({
            //             content: `Sent embed ${type} to <#${target.id}>`,
            //             ephemeral: true,
            //         });
            //         target.send({ embeds: [embed] });
            //     }
            //     break;

            case "info": {
                const embed = new EmbedBuilder()
                    .setTitle("Info")
                    .setDescription(
                        [
                            `Server IP: ${config.smp.ip}:${config.smp.port}`,
                            `Server Version: 1.19.4`,
                        ].join("\n\n")
                    )
                    .setColor("#dc143c");

                interaction.reply({
                    content: `Sent embed ${type} to <#${target.id}>`,
                    ephemeral: true,
                });
                target.send({ embeds: [embed] });
            }

            case "rules": {
                const embed = new EmbedBuilder()
                    .setTitle("Rules")
                    .setDescription(Rules)
                    .setColor("#dc143c");

                interaction.reply({
                    content: `Sent embed ${type} to <#${target.id}>`,
                    ephemeral: true,
                });
                target.send({ embeds: [embed] });
            }
        }
    },
};
