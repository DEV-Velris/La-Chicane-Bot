import { Events, Interaction, MessageFlags } from 'discord.js';
import { BotEvent } from '../../types';
import i18next from 'i18next';
import { GetPrismaClient } from '../..';
import { LanguageCode, Prisma } from '../../../generated/prisma';

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isModalSubmit() || interaction.customId !== 'create-infraction-category-modal')
      return;

    const locale = interaction.locale.startsWith('fr') ? 'fr' : 'en';

    try {
      const createViolationCategoryTranslation = (key: string, options?: object) =>
        i18next.t(`administration.violation-category.add.${key}`, {
          lng: locale,
          ...options,
        });

      const codeValue = parseInt(
        interaction.fields.getTextInputValue('create-infraction-category-code-input'),
      );
      const frenchMeaningValue = interaction.fields.getTextInputValue(
        'create-infraction-category-french-meaning-input',
      );
      const englishMeaningValue = interaction.fields.getTextInputValue(
        'create-infraction-category-english-meaning-input',
      );
      const emojiValue = interaction.fields.getTextInputValue(
        'create-infraction-category-emoji-input',
      );

      // Validate inputs
      if (isNaN(codeValue)) {
        await interaction.reply({
          content: createViolationCategoryTranslation('errors.invalid-code'),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (!frenchMeaningValue.trim()) {
        await interaction.reply({
          content: createViolationCategoryTranslation('errors.invalid-field', {
            field: locale === 'fr' ? 'Signification en français' : 'French Meaning',
          }),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (!englishMeaningValue.trim()) {
        await interaction.reply({
          content: createViolationCategoryTranslation('errors.invalid-field', {
            field: locale === 'fr' ? 'Signification en anglais' : 'English Meaning',
          }),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (!emojiValue.trim()) {
        await interaction.reply({
          content: createViolationCategoryTranslation('errors.invalid-field', {
            field: 'Emoji',
          }),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Defer the interaction to allow time for processing
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral,
      });

      // Create the violation category in the database
      try {
        const prismaClient = await GetPrismaClient();

        const newViolationCategory = await prismaClient.violationCategory.create({
          data: {
            code: codeValue,
            emoji: emojiValue,
            meaning: {
              create: {
                translations: {
                  create: [
                    {
                      language: LanguageCode.FR,
                      value: frenchMeaningValue,
                    },
                    {
                      language: LanguageCode.EN,
                      value: englishMeaningValue,
                    },
                  ],
                },
              },
            },
          },
        });

        await interaction.editReply({
          content: createViolationCategoryTranslation('success', {
            code: newViolationCategory.code,
          }),
        });
        return;
      } catch (creationError) {
        if (
          creationError instanceof Prisma.PrismaClientKnownRequestError &&
          creationError.code === 'P2002'
        ) {
          const target = creationError.meta?.target;
          if (
            (Array.isArray(target) && target.includes('code')) ||
            (typeof target === 'string' && target.includes('code'))
          ) {
            await interaction.editReply({
              content: createViolationCategoryTranslation('errors.code-already-exists'),
            });
            return;
          } else {
            console.error(
              'Database error while creating Violation Category in Database:',
              creationError,
            );
            await interaction.editReply({
              content: i18next.t('errors.general-error', {
                lng: locale,
              }),
            });
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error in create violation category modal event:', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: i18next.t('errors.general-error', {
            lng: locale,
          }),
        });
      } else {
        await interaction.reply({
          content: i18next.t('errors.general-error', {
            lng: locale,
          }),
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }
  },
};

export default event;
