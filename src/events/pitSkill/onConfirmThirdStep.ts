import { Events, Interaction, MessageFlags } from "discord.js";
import { BotEvent } from "../../types";
import { GetPrismaClient, pendingPitSkillRegistrations } from "../..";
import i18next from "i18next";

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

    const pitSkillData = pendingPitSkillRegistrations.get(interaction.user.id);

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

    // Remove the pending registration
    pendingPitSkillRegistrations.delete(interaction.user.id);

    // Reply to the user
    await interaction.reply({
      content: i18next.t("pitSkillLink.fourth-step.success", {
        lng: locale,
        roleId: 1,
      }),
      flags: MessageFlags.Ephemeral,
    });
  },
};

function getLicenseRoleId(rating: number): string {
  if (rating < 1000) return "1"; // Bronze
  if (rating < 2000) return "2"; // Silver
  if (rating < 3000) return "3"; // Gold
  if (rating < 4000) return "4"; // Platinum
  return "5"; // Diamond
}

export default event;
