import { Events, Interaction } from 'discord.js';
import { BotEvent, SlashCommand } from '../../types';

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || interaction.guildId !== process.env.DISCORD_GUILD_ID)
      return;

    const command: SlashCommand | undefined = interaction.client.commands.get(
      interaction.commandName,
    );

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: "Oops ! Une erreur est survenue lors de l'exécution de cette commande.",
        ephemeral: true,
      });

      console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}:`, error);
    }
  },
};

export default event;
