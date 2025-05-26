import { Events, Interaction, MessageFlags } from "discord.js";
import { BotEvent } from "../../../types";
import { GetPrismaClient, pendingPitSkillRegistrations } from "../../..";
import i18next from "i18next";
import { GetPitSkillDiscordRoles } from "../../../utils";

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    if (
      !interaction.isButton() ||
      interaction.customId !== "confirm_pitskill_link"
    )
      return;

    const locale = interaction.locale.startsWith("fr") ? "fr" : "en";
    const fourthStepTranslation = (key: string) =>
      i18next.t(`pitSkillLink.fourth-step.${key}`, { lng: locale });

    try {
      const pitSkillData = pendingPitSkillRegistrations.get(
        interaction.user.id
      );

      if (
        !pendingPitSkillRegistrations.has(interaction.user.id) ||
        !pitSkillData
      ) {
        await interaction.reply({
          content: fourthStepTranslation("no-pending"),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const prismaClient = await GetPrismaClient();

      // If the account is not linked, we link it
      const createdUser = await prismaClient.user.create({
        data: {
          discordId: interaction.user.id,
          pitSkillId: pitSkillData?.pitSkillId,
        },
      });

      // If the user could not be created in the database
      if (!createdUser) {
        await interaction.reply({
          content: fourthStepTranslation("database-error"),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Get the license and class role ID based on the pilot's rating
      const rolesToAdd = GetPitSkillDiscordRoles(interaction.user.id);

      if (rolesToAdd.length < 2) {
        await interaction.reply({
          content: fourthStepTranslation("roles-calculation-error"),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Add the roles to the user
      const member = await interaction.guild?.members.fetch(
        interaction.user.id
      );
      if (!member) {
        await interaction.reply({
          content: fourthStepTranslation("fetch-member-error"),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      try {
        await member.roles.add(rolesToAdd, "PitSkill link roles");
      } catch (error) {
        console.error("Error adding roles:", error);
        await interaction.reply({
          content: fourthStepTranslation("role-add-error"),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Remove the pending registration
      pendingPitSkillRegistrations.delete(interaction.user.id);

      // Reply to the user
      await interaction.reply({
        content: i18next.t("pitSkillLink.fourth-step.success", {
          lng: locale,
          licenseRoleId: rolesToAdd[0],
          levelRoleId: rolesToAdd[1],
        }),
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      await interaction.reply({
        content: fourthStepTranslation("unexpected-error"),
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default event;
