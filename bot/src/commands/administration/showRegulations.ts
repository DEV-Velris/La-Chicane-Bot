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
  name: 'show-regulations',
  data: new SlashCommandBuilder()
    .setName('show-regulations')
    .setDescription('Shows the server regulations.')
    .setNameLocalizations({
      fr: 'afficher-reglementations',
      'en-GB': 'show-regulations',
    })
    .setDescriptionLocalizations({
      fr: 'Affiche les réglementations du serveur.',
      'en-GB': 'Shows the server regulations.',
    })
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
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
      const frenchTranslation = (key: string) => i18next.t(`regulations.${key}`, { lng: 'fr' });
      const englishTranslation = (key: string) => i18next.t(`regulations.${key}`, { lng: 'en' });

      const englishAcceptButton = new ButtonBuilder()
        .setCustomId('accept_regulations_en')
        .setEmoji('🇬🇧')
        .setLabel(englishTranslation('accept-button.label'))
        .setStyle(ButtonStyle.Success);

      const askFrenchRegulations = new ButtonBuilder()
        .setCustomId('ask_french_regulations')
        .setEmoji('🇫🇷')
        .setLabel(frenchTranslation('ask-french-regulations-button.label'))
        .setStyle(ButtonStyle.Secondary);

      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
        englishAcceptButton,
        askFrenchRegulations,
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
        content: 'Regulations have been sent to the channel.',
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
