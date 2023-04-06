import { Collection } from "discord.js";

// SUMMARY: Extends the client to show "client.commands" and "client.events" as valid properties from Client
declare module "discord.js" {
    interface Client {
        commands: Collection<unknown, any>;
        subCommands: Collection<unknown, any>;
        events: Collection<unknown, any>;
    }
}

export {};
