import { Events, GuildMember, Interaction, MessageFlags } from 'discord.js';
import { BotEvent } from '../../types';
import i18next from 'i18next';

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    const customIdToHandle = ['accept_regulations_fr', 'accept_regulations_en'];

    if (!interaction.isButton() || !customIdToHandle.includes(interaction.customId)) return;

    try {
      const member = interaction.member;
      if (member === null || !(member instanceof GuildMember)) {
        await interaction.reply({
          content: 'This interaction can only be used by guild members.',
          ephemeral: true,
        });
        return;
      }

      const locale = interaction.customId.endsWith('fr') ? 'fr' : 'en';
      const regulationsTranslation = (key: string) =>
        i18next.t(`regulations.${key}`, { lng: locale });

      const piloteRole = interaction.guild?.roles.cache.get(
        process.env.REGULATIONS_ACCEPTED_ROLE_ID ?? '',
      );

      if (!piloteRole) {
        await interaction.reply({
          content: 'The regulations accepted role does not exist.',
          ephemeral: true,
        });
        return;
      }

      // If the member doesn't have the role, add it
      if (!member.roles.cache.has(piloteRole.id)) {
        await member.roles.add(piloteRole);
        await interaction.reply({
          content: regulationsTranslation('accept-message').replace(
            '{pilote}',
            `<@&${piloteRole.id}>`,
          ),
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: regulationsTranslation('already-accepted').replace(
            '{pilote}',
            `<@&${piloteRole.id}>`,
          ),
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      console.error('Error handling accept regulations interaction:', error);
      await interaction.reply({
        content: 'An error occurred while processing your request.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default event;
