import {
  CommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { getReportViolations } from '../../utils';

/**
 *  Slash command to report a pilot for infractions.
 *  This command allows users to report a pilot by providing their name,
 *   the infraction committed, and a link to video evidence.
 *   @example
 *  /report JohnDoe reckless_driving https://example.com/video
 */
export const command: SlashCommand = {
  name: 'report',
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a pilot.')
    .setNameLocalizations({
      fr: 'signaler',
      'en-GB': 'report',
    })
    .setDescriptionLocalizations({
      fr: 'Signaler un pilote.',
      'en-GB': 'Report a pilot.',
    })
    .addStringOption((option) => {
      return option
        .setName('pilot')
        .setDescription('The pilot you want to report.')
        .setNameLocalizations({
          fr: 'pilote',
          'en-GB': 'pilot',
        })
        .setDescriptionLocalizations({
          fr: 'Le pilote que vous souhaitez signaler.',
          'en-GB': 'The pilot you want to report.',
        })
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('infraction')
        .setDescription('The infraction committed by the pilot.')
        .setNameLocalizations({
          fr: 'infraction',
          'en-GB': 'infraction',
        })
        .setDescriptionLocalizations({
          fr: "L'infraction commise par le pilote.",
          'en-GB': 'The infraction committed by the pilot.',
        })
        .setChoices(
          getReportViolations().map((reason) => ({
            name: `${reason.code} - ${reason.description.english}`,
            value: reason.value,
            name_localizations: {
              fr: `${reason.code} - ${reason.description.french}`,
              'en-GB': `${reason.code} - ${reason.description.english}`,
            },
          })),
        )
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('video_link')
        .setDescription('Link to the video evidence of the infraction.')
        .setNameLocalizations({
          fr: 'lien_video',
          'en-GB': 'video_link',
        })
        .setDescriptionLocalizations({
          fr: 'Lien vers la vidéo prouvant l’infraction.',
          'en-GB': 'Link to the video evidence of the infraction.',
        })
        .setRequired(true);
    })
    .setContexts(InteractionContextType.Guild),
  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
      await interaction.reply({
        content: 'This command can only be used as a chat input command.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      const pilotName = interaction.options.getString('pilot', true);
      const infraction = interaction.options.getString('infraction', true);
      const videoLink = interaction.options.getString('video_link', true);
    } catch (error) {
      console.error('Error executing report command:', error);
      await interaction.reply({
        content: 'An error occurred while processing your report.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  },
};
