import {
  CommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { GetPrismaClient } from '../..';
import i18next from 'i18next';
import { GetPitskillDriverInfoResponse } from '../../types/api';
import {
  GetPitSkillClassEmojiId,
  GetPitSkillLevelEmojiId,
  GetPitSkillLevelName,
} from '../../utils/pitSkillUtil';
import { flag } from 'country-emoji';

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
    if (
      !interaction.channel ||
      !interaction.channel.isTextBased() ||
      interaction.channel.id !== process.env.BOT_COMMANDS_CHANNEL_ID ||
      !interaction.isChatInputCommand()
    ) {
      await interaction.reply({
        content: `This command can only be used in the <#${process.env.BOT_COMMANDS_CHANNEL_ID}> channel.`,
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    try {
      const locale = interaction.locale.startsWith('fr') ? 'fr' : 'en-GB';
      const target = interaction.options.getUser('user', false) ?? interaction.user;
      const prismaClient = await GetPrismaClient();
      const targetPitSkill = await prismaClient.user.findUnique({
        where: {
          discordId: target.id,
        },
        select: {
          pitSkillId: true,
        },
      });

      if (targetPitSkill === null || targetPitSkill.pitSkillId === null) {
        await interaction.reply({
          content: i18next.t('pitSkillLink.account-details.not-linked', {
            userId: target.id,
          }),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const driverInformations = await getDriverEmbedInformations(
        targetPitSkill.pitSkillId,
        interaction,
      );

      if (driverInformations === undefined) {
        return; // If the account details could not be fetched, exit early
      }

      await interaction.reply({
        embeds: [
          {
            title: i18next.t('pitSkillLink.account-details.embed.title', {
              lng: locale,
            }),
            description: i18next.t('pitSkillLink.account-details.embed.description', {
              pilot: driverInformations,
              lng: locale,
            }),
            color: Number(i18next.t('globalEmbed.color', { lng: locale })),
            image: {
              url: i18next.t('pitSkillLink.account-details.embed.imageUrl', {
                lng: locale,
              }),
            },
          },
        ],
      });
    } catch (error) {
      console.error('Error executing account command:', error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

type PitSkillAccountDetailsCommand = {
  firstName: string;
  lastName: string;
  nationality: string;
  lumiRank: string;
  carNumber: string;
  rank: string;
  pitRep: number;
  pitSkill: number;
  licenseClass: string;
  rankEmoji: string;
  classEmoji: string;
};

/**
 * Fetches driver embed information from the PitSkill API.
 * @param pitSkillAccountId The PitSkill account ID to fetch information for.
 * @param interaction The interaction context for the command execution.
 * @returns A promise that resolves to the driver information or undefined if an error occurs.
 */
async function getDriverEmbedInformations(
  pitSkillAccountId: number,
  interaction: CommandInteraction,
): Promise<PitSkillAccountDetailsCommand | undefined> {
  // Request to the PitSkill API to get driver information
  const pitSkillDriverInformationsResponse = await fetch(
    `https://api.pitskill.io/api/pitskill/getdriverinfo?id=${pitSkillAccountId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  // If the API response is not OK
  if (pitSkillDriverInformationsResponse.status !== 200) {
    await interaction.reply({
      content: i18next.t('pitSkillLink.third-step.api-error'),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // Parse the JSON response
  const pitSkillDriverInformations =
    (await pitSkillDriverInformationsResponse.json()) as GetPitskillDriverInfoResponse;

  // If the account is not found
  if (pitSkillDriverInformations.status !== 1) {
    await interaction.reply({
      content: i18next.t('pitSkillLink.third-step.not-found-account'),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // If the account is found, return the driver information
  const driverLevelName = GetPitSkillLevelName(
    pitSkillDriverInformations.payload.tpc_driver_data.currentPitRep,
    pitSkillDriverInformations.payload.tpc_driver_data.currentPitSkill,
    true,
  );

  const driverLevelEmoji = GetPitSkillLevelEmojiId(
    pitSkillDriverInformations.payload.tpc_driver_data.currentPitRep,
    pitSkillDriverInformations.payload.tpc_driver_data.currentPitSkill,
  );

  const driverClassEmoji = GetPitSkillClassEmojiId(
    pitSkillDriverInformations.payload.tpc_driver_data.licence_class_level,
  );

  return {
    firstName: pitSkillDriverInformations.payload.sigma_user_data.profile_data.first_name,
    lastName: pitSkillDriverInformations.payload.sigma_user_data.profile_data.last_name,
    nationality:
      flag(
        pitSkillDriverInformations.payload.sigma_user_data.profile_data.driverCountry.toLowerCase(),
      ) ?? 'Unknown',
    lumiRank: pitSkillDriverInformations.payload.sigma_user_data.profile_data.shortname,
    carNumber:
      (pitSkillDriverInformations.payload.sigma_user_data.profile_data.driver_number?.toString() ??
      interaction.locale.startsWith('fr'))
        ? 'Inconnu'
        : 'Unknown',
    rank: driverLevelName,
    pitRep: pitSkillDriverInformations.payload.tpc_driver_data.currentPitRep,
    pitSkill: pitSkillDriverInformations.payload.tpc_driver_data.currentPitSkill,
    licenseClass: pitSkillDriverInformations.payload.tpc_driver_data.licence_class,
    rankEmoji: driverLevelEmoji,
    classEmoji: driverClassEmoji,
  };
}
