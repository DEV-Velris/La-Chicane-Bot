import { Events, Interaction, MessageFlags } from 'discord.js';
import { BotEvent } from '../../../types';
import i18next from 'i18next';
import { pendingPitSkillRegistrations } from '../../..';

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isButton() || interaction.customId !== 'cancel_pitskill_link') return;

    try {
      const locale = interaction.locale.startsWith('fr') ? 'fr' : 'en';
      const fourthStepTranslation = (key: string) =>
        i18next.t(`pitSkillLink.fourth-step.${key}`, { lng: locale });

      // Check if there is a pending registration for the user
      if (!pendingPitSkillRegistrations.has(interaction.user.id)) {
        await interaction.reply({
          content: fourthStepTranslation('no-pending'),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Remove the pending registration
      pendingPitSkillRegistrations.delete(interaction.user.id);

      // Notify the user that the registration has been canceled
      await interaction.reply({
        content: fourthStepTranslation('cancellation-confirmation'),
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error('Error in cancel_pitskill_link interaction:', error);
      await interaction.reply({
        content: 'An error occurred while processing your request.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default event;
