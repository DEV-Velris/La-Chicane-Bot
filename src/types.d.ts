import { CommandInteraction, SlashCommandBuilder } from "discord.js";

declare module "discord.js" {
    export interface Client {
        commands: Map<string, SlashCommand>;
    }
}

export interface BotEvent {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => void;
}

export interface SlashCommand {
    name: string;
    data: SlashCommandBuilder | any;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export {}