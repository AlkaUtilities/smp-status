import { Client, IntentsBitField } from "discord.js";
import { config as loadenv } from "dotenv";

loadenv();

const client = new Client({
    intents: [IntentsBitField.Flags.GuildMessages],
});

client.once("ready", (bot) => {
    console.log(`[CLIENT] Logged in as ${bot.user.tag}`);
});

client.login(process.env.TOKEN);
