import { Client, REST, Routes, Snowflake } from "discord.js";
import { readdirSync, Stats, statSync } from "fs";
import { join } from "path";

const registerCommands = async (client: Client, commandsDir: string): Promise<void> => {
    const body: any = [];

    const readCommands = (dir: string): void => {
        const files: string[] = readdirSync(dir);

        for (const file of files) {
            const filePath: string = join(dir, file);
            const stat: Stats = statSync(filePath);

            if (stat.isDirectory()) {
                readCommands(filePath);
            } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                try {
                    const command = require(filePath).command;
                    if (!command) return;
                    body.push(command.data.toJSON());
                    client.commands.set(command.name, command);
                    if (process.env.DEBUG_MODE === 'true') {
                        console.log(`Commande ${command.name} chargée`);
                    }
                } catch (err) {
                    if (process.env.DEBUG_MODE === 'true') {
                        console.error(`Erreur lors du chargement de la commande ${filePath}:`, err);
                    }
                }
            }
        }
    };

    readCommands(commandsDir);

    const rest: REST = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN ?? '');

    try {
        await rest.put(Routes.applicationCommands(<Snowflake>process.env.DISCORD_BOT_ID ?? ''), { body });
    } catch (error) {
    }
};

export default async (client: Client): Promise<void> => {
    const commandsDir: string = join(__dirname, '../commands');

    client.commands.clear();

    await registerCommands(client, commandsDir);
};