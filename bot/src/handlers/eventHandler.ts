import { Client } from 'discord.js';
import { readdirSync, statSync } from 'fs';
import { BotEvent } from '../types';
import { join } from 'path';

export default (client: Client): void => {
  const eventsDir = join(__dirname, '../events');

  const loadEvents = async (dir: string): Promise<void> => {
    for (const file of readdirSync(dir)) {
      const fullPath: string = join(dir, file);
      if (statSync(fullPath).isDirectory()) {
        await loadEvents(fullPath);
      } else {
        if (!file.endsWith('.js') && !file.endsWith('.ts')) return;
        const eventModule = await import(fullPath);
        const event: BotEvent = eventModule.default;
        if (event.once) {
          client.once(event.name, (...args: unknown[]) => event.execute(...args));
        } else {
          client.on(event.name, (...args: unknown[]) => event.execute(...args));
        }
        if (process.env.DEBUG_MODE === 'true') {
          console.log(`Event ${event.name} chargé !`);
        }
      }
    }
  };

  loadEvents(eventsDir);
};
