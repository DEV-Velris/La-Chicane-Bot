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
    if (!interaction.isButton() || interaction.customId !== 'ask_french_regulations') return;

    try {
      const globalFrenchEmbedColor = i18next.t('globalEmbed.color', {
        lng: 'fr',
      });
      const frenchTranslation = (key: string) => i18next.t(`regulations.${key}`, { lng: 'fr' });

      const frenchAcceptButton = new ButtonBuilder()
        .setCustomId('accept_regulations_fr')
        .setEmoji('🇫🇷')
        .setLabel(frenchTranslation('accept-button.label'))
        .setStyle(ButtonStyle.Success);

      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(frenchAcceptButton);

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
      console.error('Error handling askFrenchRegulations event:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};

export default event;
