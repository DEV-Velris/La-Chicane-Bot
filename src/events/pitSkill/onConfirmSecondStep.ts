import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  Interaction,
  MessageFlags,
} from "discord.js";
import { BotEvent } from "../../types";
import i18next from "i18next";
import { GetPrismaClient, pendingPitSkillRegistrations } from "../..";

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    if (
      !interaction.isModalSubmit() ||
      interaction.customId !== "link_pitskill_modal"
    )
      return;

    try {
      const locale = interaction.locale.startsWith("fr") ? "fr" : "en";
      const linkPitSkillTranslation = (key: string) =>
        i18next.t(`pitSkillLink.third-step.${key}`, { lng: locale });
      const globalEmbedColor = i18next.t("globalEmbed.color", {
        lng: locale,
      });

      const referralLinkSubmitted = interaction.fields.getTextInputValue(
        "pit_skill_link_input"
      );
      const idFromReferralLink = parseInt(
        referralLinkSubmitted.split("/").pop()?.replace("?ref=", "") ?? ""
      );

      // If ID cannot be parsed
      if (isNaN(idFromReferralLink)) {
        await interaction.reply({
          content: linkPitSkillTranslation("bad-referral-link"),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Request to PitSkill API
      const pitSkillApiResponse = await fetch(
        `https://api.pitskill.io/api/pitskill/getdriverinfo?id=${idFromReferralLink}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If the API response is not OK
      if (pitSkillApiResponse.status !== 200) {
        await interaction.reply({
          content: linkPitSkillTranslation("api-error"),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const pitSkillData = await pitSkillApiResponse.json();
      // If the account is not found
      if (pitSkillData.status !== 1) {
        await interaction.reply({
          content: linkPitSkillTranslation("not-found-account"),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // If the account is already linked
      const prismaClient = await GetPrismaClient();
      const alreadyLinked = await prismaClient.user.findFirst({
        where: {
          pitSkillId: idFromReferralLink,
        },
      });

      // If the account is already linked to a Discord user
      if (alreadyLinked !== null) {
        const memberLinked = interaction.guild?.members.cache.get(
          alreadyLinked.discordId
        );
        const isSameDiscordUser =
          alreadyLinked.discordId === interaction.user.id;
        await interaction.reply({
          content: isSameDiscordUser
            ? linkPitSkillTranslation(
                "found-account.already-linked.same-account"
              )
            : linkPitSkillTranslation(
                "found-account.already-linked.different-account"
              ).replace(
                "{account}",
                memberLinked ? `<@${memberLinked.id}>` : "**Unknown User**"
              ),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const confirmButton = new ButtonBuilder()
        .setCustomId("confirm_pitskill_link")
        .setLabel(
          linkPitSkillTranslation(
            "found-account.confirm-liaison.confirm-button-label"
          )
        )
        .setStyle(ButtonStyle.Success);

      const cancelButton = new ButtonBuilder()
        .setCustomId("cancel_pitskill_link")
        .setLabel(
          linkPitSkillTranslation(
            "found-account.confirm-liaison.cancel-button-label"
          )
        )
        .setStyle(ButtonStyle.Danger);

      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
        confirmButton,
        cancelButton,
      ]);

      pendingPitSkillRegistrations.set(interaction.user.id, {
        rating: pitSkillData.payload.tpc_driver_data.currentPitSkill,
        pitSkillId: idFromReferralLink,
      });

      await interaction.reply({
        embeds: [
          {
            title: linkPitSkillTranslation(
              "found-account.confirm-liaison.title"
            ),
            description: GetConfirmationEmbedDescription(pitSkillData, locale),
            color: Number(globalEmbedColor),
            thumbnail: {
              url: pitSkillData.payload.sigma_user_data.profile_data.avatar_url,
            },
            image: {
              url: linkPitSkillTranslation(
                "found-account.confirm-liaison.imageUrl"
              ),
            },
          },
        ],
        components: [buttonRow],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("Error processing modal submission:", error);
      await interaction.reply({
        content: "An error occurred while processing your request.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default event;

function GetConfirmationEmbedDescription(pitSkillData: any, locale: string) {
  const pilote = {
    name:
      pitSkillData.payload.sigma_user_data.profile_data.first_name +
      " " +
      pitSkillData.payload.sigma_user_data.profile_data.last_name,
    shortname: pitSkillData.payload.sigma_user_data.profile_data.shortname,
    nationnality:
      pitSkillData.payload.sigma_user_data.profile_data.driverCountry,
    license: pitSkillData.payload.tpc_driver_data.licence_class,
    rating: pitSkillData.payload.tpc_driver_data.currentPitSkill,
    accountCreationDate: new Date(
      pitSkillData.payload.sigma_user_data.profile_data.createdAt
    ).toLocaleString(locale === "fr" ? "fr" : "en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  return i18next.t(
    "pitSkillLink.third-step.found-account.confirm-liaison.description",
    {
      lng: locale,
      pilote,
    }
  );
}
