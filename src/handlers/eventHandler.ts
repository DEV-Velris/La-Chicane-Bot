import { Client } from "discord.js";
import { readdirSync, statSync } from "fs";
import { BotEvent } from "../types";
import { join } from "path";

export default (client: Client): void => {
  const eventsDir = join(__dirname, "../events");

  const loadEvents = (dir: string): void => {
    readdirSync(dir).forEach((file) => {
      const fullPath: string = join(dir, file);
      if (statSync(fullPath).isDirectory()) {
        loadEvents(fullPath);
      } else {
        if (!file.endsWith(".js") && !file.endsWith(".ts")) return;
        const event: BotEvent = require(fullPath).default;
        event.once
          ? client.once(event.name, (...args: any[]) => event.execute(...args))
          : client.on(event.name, (...args: any[]) => event.execute(...args));
        if (process.env.DEBUG_MODE === "true") {
          console.log(`Event ${event.name} chargé !`);
        }
      }
    });
  };

  loadEvents(eventsDir);
};
