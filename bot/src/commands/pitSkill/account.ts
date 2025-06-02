import { CommandInteraction, InteractionContextType, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { GetPrismaClient } from '../..';
import i18next from 'i18next';

export const command: SlashCommand = {
  name: 'account',
  data: new SlashCommandBuilder()
    .setName('account')
    .setDescription('Displays your PitSkill account information.')
    .setNameLocalizations({
      fr: 'compte',
      'en-GB': 'account',
    })
    .setDescriptionLocalizations({
      fr: 'Affiche les informations de votre compte PitSkill.',
      'en-GB': 'Displays your PitSkill account information.',
    })
    .addUserOption((option) => {
      return option
        .setName('user')
        .setDescription('The user whose account information you want to display.')
        .setNameLocalizations({
          fr: 'utilisateur',
          'en-GB': 'user',
        })
        .setDescriptionLocalizations({
          fr: "L'utilisateur dont vous souhaitez afficher les informations de compte.",
          'en-GB': 'The user whose account information you want to display.',
        })
        .setRequired(false);
    })
    .setContexts(InteractionContextType.Guild),
  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.channel || !interaction.channel.isTextBased() || interaction.channel.id !== process.env.BOT_COMMANDS_CHANNEL_ID || !interaction.isChatInputCommand()) {
      await interaction.reply({
        content: `This command can only be used in the <#${process.env.BOT_COMMANDS_CHANNEL_ID}> channel.`,
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    try {
        const locale = interaction.locale.startsWith('fr') ? 'fr' : 'en-GB';
        const accountDetailTranslation = (key: string) => i18next.t(`pitSkillLink.account-details.${key}`, { lng: locale });
        const target = interaction.options.getUser("user", false) ?? interaction.user;
        const prismaClient = await GetPrismaClient();
        const targetPitSkillId = prismaClient.user.findUnique({
            where: {
                discordId: target.id,
            },
            select: {
                pitSkillId: true,
            }
        });

        if (targetPitSkillId === null) {
            await interaction.reply({
                content: accountDetailTranslation('not-linked', {
                    userId: target.id,
                }),
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
    } catch (error) {
        console.error('Error executing account command:', error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
