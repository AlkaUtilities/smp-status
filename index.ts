import { Client, IntentsBitField, ChannelType, EmbedBuilder } from "discord.js";
import { status as ServerStatus } from "minecraft-server-util";
// import { config as loadenv } from "dotenv";
import express from "express";
import config from "./config";
import {} from "./typings/enviroment";

const TOKEN = process.env["TOKEN"];

// loadenv();

const app = express();

const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.Guilds,
    ],
});

app.get("/", (req, res) => res.sendStatus(200));

client.once("ready", async (bot) => {
    console.log(`[CLIENT] Logged in as ${bot.user.tag}`);

    if (!config.smp.ip) {
        console.warn("IP address is empty");
        process.exit(0);
    }
    if (!config.status.channel) {
        console.warn("Status channel is empty");
        process.exit(0);
    }

    UpdateMessage();
});

client.login(process.env["TOKEN"]);

let status = "unreachable";
let last_server_status = "unknown";

async function UpdateMessage() {
    const statusChannel = client.channels.cache.get(config.status.channel);

    if (!statusChannel) {
        console.error("Status channel not found");
        process.exit(0);
    }
    if (statusChannel.type !== ChannelType.GuildText) {
        console.error("Channel is not GuildText");
        process.exit(0);
    }

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
            embeds: [new EmbedBuilder().setDescription("Initial message")],
        });
    }

    try {
        let version: any = {
            name: "",
            protocol: 0,
        };

        let players: any = {
            online: 0,
            max: 0,
            sample: null,
        };

        await ServerStatus(config.smp.ip, config.smp.port || 25565).then(
            (res) => {
                version = res.version;
                players = res.players;
                console.log(
                    `[${config.smp.ip.replace(
                        ".aternos.me",
                        ""
                    )}]    [status]  ${res.version.name} ${
                        res.players.online
                    }/${res.players.max}`
                );
            }
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

        console.log(
            `[${config.smp.ip.replace(
                ".aternos.me",
                ""
            )}]    [compare] last: ${last_server_status} | current: ${status} | ${
                last_server_status !== status || status === "online"
                    ? "true"
                    : "false"
            }`
        );
        if (last_server_status !== status || status === "online") {
            last_server_status = status;
            await statusMessage.edit({
                content: "",
                embeds: [await BuildEmbed(version, players)],
            });
        }
    } catch (err) {
        console.log(
            `[${config.smp.ip.replace(".aternos.me", "")}] [status-err] ${err}`
        );
        status = "unreachable";
        await statusMessage.edit({
            content: "",
            embeds: [
                new EmbedBuilder()
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
                            `\n\`${err}\``,
                        ].join("\n")
                    ),
            ],
        });
    }

    await sleep(config.status.updateInterval * 1000);
    UpdateMessage();
}

async function BuildEmbed(
    version: { name: string; protocol: number },
    players: {
        online: number;
        max: number;
        sample: { name: string; id: string }[] | null;
    }
) {
    const embed = new EmbedBuilder().setTimestamp();

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
    return str[0]?.toUpperCase() + str?.substring(1);
}

app.listen(config.port, () =>
    console.log(`[EXPRESS] Listening on port ${config.port}`)
);

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
