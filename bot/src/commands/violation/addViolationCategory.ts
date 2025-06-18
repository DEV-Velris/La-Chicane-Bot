import {
  ActionRowBuilder,
  CommandInteraction,
  InteractionContextType,
  MessageFlags,
  ModalBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { SlashCommand } from '../../types';
import i18next from 'i18next';

export const command: SlashCommand = {
  name: 'add-violation-category',
  data: new SlashCommandBuilder()
    .setName('add-violation-category')
    .setDescription('Add a new violation category.')
    .setNameLocalizations({
      fr: 'ajouter-categorie-infraction',
      'en-GB': 'add-violation-category',
    })
    .setDescriptionLocalizations({
      fr: "Ajouter une nouvelle catégorie d'infraction.",
      'en-GB': 'Add a new violation category.',
    })
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      const locale = interaction.locale.startsWith('fr') ? 'fr' : 'en';
      const addInfractionCategoryTranslation = (key: string) =>
        i18next.t(`administration.violation-category.add.${key}`, { lng: locale });

      // #region Create Infraction Category Modal
      const createInfractionCategoryModal = new ModalBuilder()
        .setCustomId('create-infraction-category-modal')
        .setTitle(addInfractionCategoryTranslation('modal.title'));

      // Components
      const codeInput = new TextInputBuilder()
        .setCustomId('create-infraction-category-code-input')
        .setLabel(addInfractionCategoryTranslation('modal.code-input.label'))
        .setPlaceholder(addInfractionCategoryTranslation('modal.code-input.placeholder'))
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const frenchMeaningInput = new TextInputBuilder()
        .setCustomId('create-infraction-category-french-meaning-input')
        .setLabel(addInfractionCategoryTranslation('modal.french-meaning-input.label'))
        .setPlaceholder(addInfractionCategoryTranslation('modal.french-meaning-input.placeholder'))
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const englishMeaningInput = new TextInputBuilder()
        .setCustomId('create-infraction-category-english-meaning-input')
        .setLabel(addInfractionCategoryTranslation('modal.english-meaning-input.label'))
        .setPlaceholder(addInfractionCategoryTranslation('modal.english-meaning-input.placeholder'))
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const emojiInput = new TextInputBuilder()
        .setCustomId('create-infraction-category-emoji-input')
        .setLabel(addInfractionCategoryTranslation('modal.emoji-input.label'))
        .setPlaceholder(addInfractionCategoryTranslation('modal.emoji-input.placeholder'))
        .setStyle(TextInputStyle.Short)
        .setMaxLength(1)
        .setRequired(true);

      const codeRow = new ActionRowBuilder<TextInputBuilder>().addComponents(codeInput);
      const frenchMeaningRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
        frenchMeaningInput,
      );
      const englishMeaningRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
        englishMeaningInput,
      );
      const emojiRow = new ActionRowBuilder<TextInputBuilder>().addComponents(emojiInput);

      createInfractionCategoryModal.addComponents(
        codeRow,
        frenchMeaningRow,
        englishMeaningRow,
        emojiRow,
      );
      // #endregion

      await interaction.showModal(createInfractionCategoryModal);
    } catch (error) {
      console.error('Error executing the "add-infraction-category" command:', error);
      await interaction.reply({
        content: 'An error occurred while processing your request.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
