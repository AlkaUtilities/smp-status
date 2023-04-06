import { Client } from "discord.js";
import { load_commands } from "../../handlers/command";
import { UpdateMessage } from "../..";
import config from "../../config";

module.exports = {
    name: "ready",
    once: true,
    execute(client: Client) {
        console.log(`[CLIENT] Logged in as ${client.user?.tag}`);

        const global = process.argv[2] === "global" ? true : false;

        load_commands(client, global);

        if (!config.smp.ip) {
            console.warn("IP address is empty");
            process.exit(0);
        }
        if (!config.status.channel) {
            console.warn("Status channel is empty");
            process.exit(0);
        }

        // UpdateMessage();
    },
};
