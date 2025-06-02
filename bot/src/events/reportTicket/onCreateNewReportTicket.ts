import { ChannelType, Events, Interaction, MessageFlags } from 'discord.js';
import { BotEvent } from '../../types';
import i18next from 'i18next';
import { flag } from 'country-emoji';

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isButton() || interaction.customId !== 'create_report_ticket') return;

    try {
      const locale = interaction.locale?.startsWith('fr') ? 'fr' : 'en';
      const globalEmbedColor = i18next.t('globalEmbed.color', {
        lng: locale,
      });
      const translation = (key: string) => i18next.t(`report-ticket.${key}`, { lng: locale });

      // Create the report ticket channel
      const reportTicketCategory = interaction.guild?.channels.cache.get(
        process.env.TICKETS_CATEGORY_ID,
      );

      if (reportTicketCategory === undefined) {
        await interaction.reply({
          content: translation('error.category-not-found'),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const reportTicketChannel = await interaction.guild?.channels.create({
        type: ChannelType.GuildText,
        name: `${flag(locale)} - ${interaction.user.username}`,
      });

      //todo
    } catch (error) {
      console.error('Error handling onCreateNewReportTicket event:', error);
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
