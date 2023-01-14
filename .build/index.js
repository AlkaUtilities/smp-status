"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_discord = require("discord.js");
var import_minecraft_server_util = require("minecraft-server-util");
var import_express = __toESM(require("express"));
var import_config = __toESM(require("./config"));
var import_dotenv = require("dotenv");
//! Disable in replit
(0, import_dotenv.config)();
console.log(`[CONFIG] ip: ${import_config.default.smp.ip} | port: ${import_config.default.smp.port}`);
const app = (0, import_express.default)();
const client = new import_discord.Client({
  intents: [
    import_discord.IntentsBitField.Flags.GuildMessages,
    import_discord.IntentsBitField.Flags.Guilds
  ]
});
app.get("/", (req, res) => {
  if (client.user === null)
    return res.sendStatus(500);
  res.sendStatus(200);
});
client.once("ready", async (bot) => {
  console.log(`[CLIENT] Logged in as ${bot.user.tag}`);
  if (!import_config.default.smp.ip) {
    console.warn("IP address is empty");
    process.exit(0);
  }
  if (!import_config.default.status.channel) {
    console.warn("Status channel is empty");
    process.exit(0);
  }
  UpdateMessage();
});
client.login(process.env["TOKEN"]);
let status = "unreachable";
let last_server_status = "unknown";
async function UpdateMessage() {
  const statusChannel = client.channels.cache.get(import_config.default.status.channel);
  if (!statusChannel) {
    console.error("Status channel not found");
    process.exit(0);
  }
  if (statusChannel.type !== import_discord.ChannelType.GuildText) {
    console.error("Channel is not GuildText");
    process.exit(0);
  }
  let statusMessage = (await statusChannel.messages.fetch().then(
    (messages) => messages.filter((m) => {
      var _a;
      return m.author.id === ((_a = client.user) == null ? void 0 : _a.id);
    }).sort((a, b) => b.createdTimestamp - a.createdTimestamp)
  )).first();
  if (statusMessage === void 0) {
    statusMessage = await statusChannel.send({
      embeds: [new import_discord.EmbedBuilder().setDescription("Initial message")]
    });
  }
  try {
    let version = {
      name: "",
      protocol: 0
    };
    let players = {
      online: 0,
      max: 0,
      sample: null
    };
    await (0, import_minecraft_server_util.status)(import_config.default.smp.ip, import_config.default.smp.port || 25565).then(
      (res) => {
        version = res.version;
        players = res.players;
        const date = new Date();
        if (import_config.default.debug) {
          console.log(
            `[${padWithLeadingZeros(
              date.getHours(),
              2
            )}:${padWithLeadingZeros(
              date.getMinutes(),
              2
            )}:${padWithLeadingZeros(
              date.getSeconds(),
              2
            )}] [status]     ${res.version.name} ${res.players.online}/${res.players.max}`
          );
        }
      }
    );
    if (version.protocol === 46) {
      status = version.name.slice(4).replace(/\./g, "").toLowerCase();
    } else if (version.protocol === 760) {
      status = "online";
    }
    if (import_config.default.debug) {
      const date = new Date();
      console.log(
        `[${padWithLeadingZeros(
          date.getHours(),
          2
        )}:${padWithLeadingZeros(
          date.getMinutes(),
          2
        )}:${padWithLeadingZeros(
          date.getSeconds(),
          2
        )}] [comparison] last: ${last_server_status} | current: ${status} | ${last_server_status !== status || status === "online" ? "true" : "false"}`
      );
    }
    if (last_server_status !== status) {
      if (import_config.default.debug) {
        const date = new Date();
        console.log(
          `[${padWithLeadingZeros(
            date.getHours(),
            2
          )}:${padWithLeadingZeros(
            date.getMinutes(),
            2
          )}:${padWithLeadingZeros(
            date.getSeconds(),
            2
          )}] [msg-embed]  Updated message embed. from: ${last_server_status} | to: ${status}`
        );
      }
      last_server_status = status;
      await statusMessage.edit({
        content: "",
        embeds: [await BuildEmbed(version, players)]
      });
      UpdateStatus();
    }
  } catch (err) {
    status = "unreachable";
    if (import_config.default.debug) {
      const date = new Date();
      console.log(
        `[${padWithLeadingZeros(
          date.getHours(),
          2
        )}:${padWithLeadingZeros(
          date.getMinutes(),
          2
        )}:${padWithLeadingZeros(
          date.getSeconds(),
          2
        )}] [status-err] ${err}`
      );
    }
    if (last_server_status !== status) {
      if (import_config.default.debug) {
        const date = new Date();
        console.log(
          `[${padWithLeadingZeros(
            date.getHours(),
            2
          )}:${padWithLeadingZeros(
            date.getMinutes(),
            2
          )}:${padWithLeadingZeros(
            date.getSeconds(),
            2
          )}] [msg-embed]  Updated message embed. from: ${last_server_status} | to: ${status}`
        );
      }
      last_server_status = status;
      await statusMessage.edit({
        content: "",
        embeds: [
          new import_discord.EmbedBuilder().setTimestamp().setTitle("Unreachable").setThumbnail(import_config.default.icons.unreachable).setColor(`#${import_config.default.colors.unreachable}`).setDescription(
            [
              `The server is currently unreachable`,
              `The server might currently be starting/stopping`,
              `Last status: ${capitalize(last_server_status)}`,
              `IP Address: \`${import_config.default.smp.ip}:${import_config.default.smp.port}\``,
              `
\`${err}\``
            ].join("\n")
          )
        ]
      });
      UpdateStatus();
    }
  }
  await sleep(import_config.default.status.updateInterval * 1e3);
  UpdateMessage();
}
async function BuildEmbed(version, players) {
  const embed = new import_discord.EmbedBuilder().setTimestamp();
  if (status === "offline") {
    embed.setTitle("Offline").setThumbnail(import_config.default.icons.offline).setColor(`#${import_config.default.colors.offline}`).setDescription(
      [
        `The server is currently offline
`,
        `IP Address: \`${import_config.default.smp.ip}:${import_config.default.smp.port}\``
      ].join("\n")
    );
  } else if (status === "preparing") {
    embed.setTitle("Preparing").setThumbnail(import_config.default.icons.preparing).setColor(`#${import_config.default.colors.preparing}`).setDescription(
      [
        `The server is currently starting
`,
        `IP Address: \`${import_config.default.smp.ip}:${import_config.default.smp.port}\``
      ].join("\n")
    );
  } else if (status === "loading") {
    embed.setTitle("Loading").setThumbnail(import_config.default.icons.loading).setColor(`#${import_config.default.colors.loading}`).setDescription(
      [
        `The server is currently starting
`,
        `IP Address: \`${import_config.default.smp.ip}:${import_config.default.smp.port}\``
      ].join("\n")
    );
  } else if (status === "online") {
    embed.setTitle("Online").setThumbnail(import_config.default.icons.online).setColor(`#${import_config.default.colors.online}`).setDescription(
      [
        `The server is currently online
`,
        `IP Address: \`${import_config.default.smp.ip}:${import_config.default.smp.port}\``,
        `Version: ${version.name}`
      ].join("\n")
    );
  } else if (status === "saving") {
    embed.setTitle("Saving").setThumbnail(import_config.default.icons.saving).setColor(`#${import_config.default.colors.saving}`).setDescription(
      [
        `The server is currently stopping
`,
        `IP Address: \`${import_config.default.smp.ip}:${import_config.default.smp.port}\``
      ].join("\n")
    );
  }
  return embed;
}
function UpdateStatus() {
  var _a, _b;
  if (status === "online") {
    (_a = client.user) == null ? void 0 : _a.setPresence({
      status: "online",
      activities: [
        {
          name: import_config.default.smp.port ? `${import_config.default.smp.ip}:${import_config.default.smp.port}` : `${import_config.default.smp.ip}`,
          type: import_discord.ActivityType.Playing
        }
      ]
    });
  } else {
    (_b = client.user) == null ? void 0 : _b.setPresence({
      status: "dnd"
    });
  }
}
function capitalize(str) {
  var _a;
  return ((_a = str[0]) == null ? void 0 : _a.toUpperCase()) + (str == null ? void 0 : str.substring(1));
}
app.listen(
  import_config.default.port,
  () => console.log(`[EXPRESS] Listening on port ${import_config.default.port}`)
);
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function padWithLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, "0");
}
//# sourceMappingURL=index.js.map
