import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import i18next from "i18next";

export const command: SlashCommand = {
  name: "link-pitskill-account",
  data: new SlashCommandBuilder()
    .setName("link-pitskill-account")

    .setDescription("Links your PitSkill account to your Discord account.")
    .setNameLocalizations({
      fr: "lier-compte-pitskill",
      "en-GB": "link-pitskill-account",
    })
    .setDescriptionLocalizations({
      fr: "Liaison de votre compte PitSkill à votre compte Discord.",
      "en-GB": "Links your PitSkill account to your Discord account.",
    }),
  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.channel || !interaction.channel.isTextBased()) {
      await interaction.reply({
        content: "This command can only be used in a text channel.",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      const locale = interaction.locale?.startsWith("fr") ? "fr" : "en";
      const linkpitskillTranslation = (key: string) =>
        i18next.t(`pitSkillLink.first-step.${key}`, { lng: locale });
      const globalEmbedColor = i18next.t("globalEmbed.color", {
        lng: locale,
      });

      const linkPitSkillAcceptButton = new ButtonBuilder()
        .setCustomId("link_pitskill_first_step")
        .setEmoji("🪢")
        .setLabel(linkpitskillTranslation("link-button-label"))
        .setStyle(ButtonStyle.Success);

      const linkPitSkillGoToButton = new ButtonBuilder()
        .setEmoji("🔗")
        .setLabel(linkpitskillTranslation("go-to-button-label"))
        .setStyle(ButtonStyle.Link)
        .setURL("https://pitskill.io/referral-program");

      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
        linkPitSkillAcceptButton,
        linkPitSkillGoToButton,
      ]);

      interaction.reply({
        embeds: [
          {
            title: linkpitskillTranslation("title"),
            description: linkpitskillTranslation("description"),
            color: Number(globalEmbedColor),
            image: {
              url: linkpitskillTranslation("imageUrl"),
            },
          },
        ],
        components: [buttonRow],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("Error executing linkpitskill command:", error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
