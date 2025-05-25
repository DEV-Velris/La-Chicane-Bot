import {
  ActionRowBuilder,
  Events,
  Interaction,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { BotEvent } from "../../types";
import i18n from "../../i18n";

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    if (
      !interaction.isButton() ||
      interaction.customId !== "link_pitskill_first_step"
    )
      return;

    try {
      const locale = interaction.locale?.startsWith("fr") ? "fr" : "en";
      const linkpitskillTranslation = (key: string) =>
        i18n.t(`pitSkillLink.second-step.${key}`, {
          lng: locale,
        });

      const pitSkillTextInput = new TextInputBuilder()
        .setCustomId("pit_skill_link_input")
        .setLabel(linkpitskillTranslation("input-label"))
        .setPlaceholder(linkpitskillTranslation("input-placeholder"))
        .setStyle(TextInputStyle.Short);

      const inputRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
        pitSkillTextInput
      );

      const modal = new ModalBuilder()
        .setCustomId("link_pitskill_modal")
        .setTitle(linkpitskillTranslation("modal-title"))
        .setComponents([inputRow]);

      await interaction.showModal(modal);
    } catch (error) {
      console.error("Error showing modal:", error);
      await interaction.reply({
        content: "An error occurred while processing your request.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default event;
