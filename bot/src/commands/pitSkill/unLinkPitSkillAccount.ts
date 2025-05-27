import { CommandInteraction, GuildMember, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import i18next from 'i18next';
import { GetPrismaClient } from '../..';

export const command: SlashCommand = {
  name: 'unlink-pitskill-account',
  data: new SlashCommandBuilder()
    .setName('unlink-pitskill-account')
    .setDescription('Unlinks your PitSkill account from your Discord account.')
    .setNameLocalizations({
      fr: 'dissocier-compte-pitskill',
      'en-GB': 'unlink-pitskill-account',
    })
    .setDescriptionLocalizations({
      fr: 'Dissocie votre compte PitSkill de votre compte Discord.',
      'en-GB': 'Unlinks your PitSkill account from your Discord account.',
    }),
  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.channel || !interaction.channel.isTextBased() || !interaction.inGuild()) {
      await interaction.reply({
        content: 'This command can only be used in a text channel.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const locale = interaction.locale?.startsWith('fr') ? 'fr' : 'en';
    const unlinkPitSkillTranslation = (key: string) =>
      i18next.t(`pitSkillLink.unlink.${key}`, { lng: locale });

    try {
      const prismaClient = await GetPrismaClient();

      const user = await prismaClient.user.findUnique({
        where: {
          discordId: interaction.user.id,
        },
      });

      if (!user) {
        await interaction.reply({
          content: i18next.t('errors.no-discord-linked-account', { lng: locale }),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (!user.pitSkillId) {
        await interaction.reply({
          content: unlinkPitSkillTranslation('no-linked-account'),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      await prismaClient.user.update({
        where: {
          discordId: interaction.user.id,
        },
        data: {
          pitSkillId: null,
        },
      });

      const levelsRolesId = [
        process.env.ELITE_LEVEL_ROLE_ID,
        process.env.PRO_LEVEL_ROLE_ID,
        process.env.VETERAN_LEVEL_ROLE_ID,
        process.env.PLATINUM_LEVEL_ROLE_ID,
        process.env.SILVER_LEVEL_ROLE_ID,
        process.env.STEEL_LEVEL_ROLE_ID,
        process.env.BRONZE_LEVEL_ROLE_ID,
        process.env.COPPER_LEVEL_ROLE_ID,
        process.env.AM_LEVEL_ROLE_ID,
        process.env.PROVISIONAL_LEVEL_ROLE_ID,
      ];

      const licenseRolesId = [
        process.env.CLASS_S_LICENSE_ROLE_ID,
        process.env.CLASS_A_LICENSE_ROLE_ID,
        process.env.CLASS_B_LICENSE_ROLE_ID,
        process.env.CLASS_C_LICENSE_ROLE_ID,
        process.env.ROOKIE_LICENSE_ROLE_ID,
      ];

      // Remove all PitSkill level and license roles from the user
      try {
        const member = interaction.member as GuildMember;
        const rolesToRemove = member.roles.cache.filter(
          (role) => levelsRolesId.includes(role.id) || licenseRolesId.includes(role.id),
        );

        member.roles.remove(rolesToRemove);
      } catch (error) {
        console.error('Error while removing PitSkill roles:', error);
      }

      await interaction.reply({
        content: unlinkPitSkillTranslation('success'),
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error('Error while unlinking PitSkill account:', error);
      await interaction.reply({
        content: unlinkPitSkillTranslation('error'),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  },
};
