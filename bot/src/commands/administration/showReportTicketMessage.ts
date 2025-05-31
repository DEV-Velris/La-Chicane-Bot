import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  MessageFlags,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../../types';
import i18next from 'i18next';

export const command: SlashCommand = {
  name: 'show-ticket-report-message',
  data: new SlashCommandBuilder()
    .setName('show-ticket-report-message')
    .setDescription('Shows the report ticket message for the server.')
    .setNameLocalizations({
      fr: 'afficher-message-rapport-ticket',
      'en-GB': 'show-ticket-report-message',
    })
    .setDescriptionLocalizations({
      fr: 'Affiche le message de rapport de ticket pour le serveur.',
      'en-GB': 'Shows the report ticket message for the server.',
    })
    .setDefaultMemberPermissions(PermissionsBitField.Flags.AddReactions),
  async execute(interaction: CommandInteraction): Promise<void> {
    if (
      !interaction.channel ||
      !interaction.channel.isTextBased() ||
      !('send' in interaction.channel)
    ) {
      await interaction.reply({
        content: 'This command can only be used in a text channel.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      const globalEnglishEmbedColor = i18next.t('globalEmbed.color', {
        lng: 'en',
      });
      const frenchTranslation = (key: string) => i18next.t(`report-ticket.${key}`, { lng: 'fr' });
      const englishTranslation = (key: string) => i18next.t(`report-ticket.${key}`, { lng: 'en' });

      const createTicketButton = new ButtonBuilder()
        .setCustomId('create_report_ticket')
        .setEmoji('🎟️')
        .setLabel(englishTranslation('submit-button.label'))
        .setStyle(ButtonStyle.Primary);

      const showFrenchReportMessage = new ButtonBuilder()
        .setCustomId('ask_french_report_message')
        .setEmoji('🇫🇷')
        .setLabel(frenchTranslation('ask-french-report-button.label'))
        .setStyle(ButtonStyle.Secondary);

      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
        createTicketButton,
        showFrenchReportMessage,
      ]);

      await interaction.channel.send({
        embeds: [
          {
            title: englishTranslation('embed.title'),
            description: englishTranslation('embed.description'),
            color: Number(globalEnglishEmbedColor),
            image: {
              url: englishTranslation('embed.imageUrl'),
            },
          },
        ],
        components: [buttonRow],
      });

      await interaction.reply({
        content: 'The report ticket message has been sent successfully.',
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error('Error executing showregulations command:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
