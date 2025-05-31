import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  Interaction,
  MessageFlags,
} from 'discord.js';
import { BotEvent } from '../../types';
import i18next from 'i18next';

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isButton() || interaction.customId !== 'ask_french_report_message') return;

    try {
      const globalFrenchEmbedColor = i18next.t('globalEmbed.color', {
        lng: 'fr',
      });
      const frenchTranslation = (key: string) => i18next.t(`report-ticket.${key}`, { lng: 'fr' });

      const createTicketButton = new ButtonBuilder()
        .setCustomId('create_report_ticket')
        .setEmoji('🎟️')
        .setLabel(frenchTranslation('submit-button.label'))
        .setStyle(ButtonStyle.Primary);

      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(createTicketButton);

      await interaction.reply({
        embeds: [
            {
            title: frenchTranslation('embed.title'),
            description: frenchTranslation('embed.description'),
            color: Number(globalFrenchEmbedColor),
            image: {
              url: frenchTranslation('embed.imageUrl'),
            },
          },
        ],
        components: [buttonRow],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error('Error handling askFrenchReportMessage event:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'There was an error while executing the interaction !',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};

export default event;
