import { Client, Events } from 'discord.js';
import { BotEvent } from '../../types';

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client): Promise<void> {
    console.log(`Bot is ready! Logged in as ${client.user?.tag}`);
  },
};

export default event;
