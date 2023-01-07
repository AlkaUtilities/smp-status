import { Client, IntentsBitField, ChannelType, EmbedBuilder } from "discord.js";
import { status as ServerStatus } from "minecraft-server-util";
import { config as loadenv } from "dotenv";
import config from "./config";
import {} from "./typings/enviroment";

loadenv();

const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.Guilds,
    ],
});

client.once("ready", async (bot) => {
    console.log(`[CLIENT] Logged in as ${bot.user.tag}`);

    const statusTimer = setInterval(
        UpdateMessage,
        config.status.updateInterval * 1000
    );
});

let status = "unreachable";
let last_server_status = "";

async function UpdateMessage() {
    const statusChannel = client.channels.cache.get(config.status.channel);

    if (!statusChannel || statusChannel.type !== ChannelType.GuildText) return;

    let statusMessage = (
        await statusChannel.messages
            .fetch()
            .then((messages) =>
                messages
                    .filter((m) => m.author.id === client.user?.id)
                    .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
            )
    ).first();

    if (statusMessage === undefined) {
        statusMessage = await statusChannel.send({
            embeds: [new EmbedBuilder().setDescription("Initial message.")],
        });
    }

    try {
        let { version, players } = await ServerStatus(
            config.smp.ip,
            config.smp.port || 25565
        );

        /**
         * if connection refused (happens when server is starting)
         * display "connecton refused. last status: ${last_status}"
         * to give the users a hint on why the server is unreachable
         *
         *  online version protocol: 760
         *  other  version protocol: 46
         */

        // using else if
        // if (version.name === "§4● Offline" && version.protocol === 46) {
        //     status = "offline";
        // } else if (version.name === "§7◌ Preparing..." && version.protocol === 46) {
        //     status = "preparing";
        // } else if (version.name === "§7◌ Loading..." && version.protocol === 46) {
        //     status = "loading";
        // } else if (version.name === "§7◌ Saving..." && version.protocol === 46) {
        //     status = "saving";
        // } else if (version.protocol === 760) {
        //     status = "online";
        // }

        if (version.protocol === 46) {
            status = version.name.slice(4).replace(/\./g, "").toLowerCase();
        } else if (version.protocol === 760) {
            status = "online";
        }

        if (last_server_status !== status) {
            last_server_status = status;
            await statusMessage.edit({
                content: "",
                embeds: [await BuildEmbed(version, players)],
            });
        }
    } catch (err) {
        status = "unreachable";
        await statusMessage.edit({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        iconURL: config.icons.author,
                        name:
                            !config.smp.port || config.smp.port === 25565
                                ? `${config.smp.ip}`
                                : `${config.smp.ip}:${config.smp.port}`,
                    })
                    .setTimestamp()
                    .setTitle("Unreachable")
                    .setThumbnail(config.icons.unreachable)
                    .setColor(`#${config.colors.unreachable}`)
                    .setDescription(
                        [
                            `The server is currently unreachable`,
                            `The server might currently be starting/stopping`,
                            `Last status: ${capitalize(last_server_status)}\n`,
                            `IP Address: \`${config.smp.ip}:${config.smp.port}\``,
                        ].join("\n")
                    ),
            ],
        });
    }
}

async function BuildEmbed(
    version: { name: string; protocol: number },
    players: {
        online: number;
        max: number;
        sample: { name: string; id: string }[] | null;
    }
) {
    const embed = new EmbedBuilder()
        .setAuthor({
            iconURL: config.icons.author,
            name:
                !config.smp.port || config.smp.port === 25565
                    ? `${config.smp.ip}`
                    : `${config.smp.ip}:${config.smp.port}`,
        })
        .setTimestamp();

    if (status === "offline") {
        embed
            .setTitle("Offline")
            .setThumbnail(config.icons.offline)
            .setColor(`#${config.colors.offline}`)
            .setDescription(
                [
                    `The server is currently offline\n`,
                    `IP Address: \`${config.smp.ip}:${config.smp.port}\``,
                ].join("\n")
            );
    } else if (status === "preparing") {
        embed
            .setTitle("Preparing")
            .setThumbnail(config.icons.preparing)
            .setColor(`#${config.colors.preparing}`)
            .setDescription(
                [
                    `The server is currently starting\n`,
                    `IP Address: \`${config.smp.ip}:${config.smp.port}\``,
                ].join("\n")
            );
    } else if (status === "loading") {
        embed
            .setTitle("Loading")
            .setThumbnail(config.icons.loading)
            .setColor(`#${config.colors.loading}`)
            .setDescription(
                [
                    `The server is currently starting\n`,
                    `IP Address: \`${config.smp.ip}:${config.smp.port}\``,
                ].join("\n")
            );
    } else if (status === "online") {
        embed
            .setTitle("Online")
            .setThumbnail(config.icons.online)
            .setColor(`#${config.colors.online}`)
            .setDescription(
                [
                    `The server is currently online\n`,
                    `IP Address: \`${config.smp.ip}:${config.smp.port}\``,
                    `Version: ${version.name}`,
                    `Players: ${players.online}/${players.max} online`,
                ].join("\n")
            );
    } else if (status === "saving") {
        embed
            .setTitle("Saving")
            .setThumbnail(config.icons.saving)
            .setColor(`#${config.colors.saving}`)
            .setDescription(
                [
                    `The server is currently stopping\n`,
                    `IP Address: \`${config.smp.ip}:${config.smp.port}\``,
                ].join("\n")
            );
    }

    return embed;
}

function capitalize(str: string) {
    return str[0].toUpperCase() + str.substring(1);
}

client.login(process.env.TOKEN);
