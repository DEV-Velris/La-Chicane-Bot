import {
  ActivityType,
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import { configDotenv } from "dotenv";
import { SlashCommand } from "./types";
import { join } from "path";
import { readdirSync } from "fs";
import { initI18n } from "./i18n";
import { PrismaClient } from "./generated/prisma";
import "./schedulers/pitSkillRolesChecker";

configDotenv();

const prismaClient = new PrismaClient();
prismaClient.$connect().catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
});

export async function GetPrismaClient(): Promise<PrismaClient> {
  if (!prismaClient) {
    throw new Error("Prisma client is not initialized.");
  }
  return prismaClient;
}

export const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  presence: {
    status: "online",
    activities: [
      {
        type: ActivityType.Competing,
        name: "La Chicane",
        url: "https://www.discord.gg/uyZ6WCp2Vz",
      },
    ],
  },
});

export const pendingPitSkillRegistrations: Map<
  string,
  {
    pitSkillId: number;
    pitSkill: number;
    pitRep: number;
    licenseClassLevel: number;
  }
> = new Map();

(async () => {
  await initI18n();
  discordClient.setMaxListeners(20);
  discordClient.commands = new Collection<string, SlashCommand>();
  const handlersDir: string = join(__dirname, "./handlers");
  readdirSync(handlersDir).forEach(async (file): Promise<void> => {
    const handler = await import(`${handlersDir}/${file}`);
    handler.default(discordClient);
  });
  discordClient.login(process.env.DISCORD_TOKEN);
})();
