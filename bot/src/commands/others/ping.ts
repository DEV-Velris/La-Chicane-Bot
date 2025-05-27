import { CommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import i18next from '../../i18n';

export const command: SlashCommand = {
  name: 'ping',
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .setDescriptionLocalizations({
      fr: 'Répond avec Pong !',
      'en-GB': 'Replies with Pong!',
    }),
  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      const locale = interaction.locale?.startsWith('fr') ? 'fr' : 'en';
      const pingTranslation = (key: string) => i18next.t(`ping.${key}`, { lng: locale });
      const globalEmbedLang = (key: string) => i18next.t(`globalEmbed.${key}`, { lng: locale });

      await interaction.reply({
        content: pingTranslation('waiting'),
        flags: MessageFlags.Ephemeral,
      });
      const reply = await interaction.fetchReply();
      const latency = reply.createdTimestamp - interaction.createdTimestamp;
      const apiLatency = Math.round(interaction.client.ws.ping);

      await interaction.editReply({
        content: null,
        embeds: [
          {
            title: pingTranslation('title'),
            description: `${GetLatencyIcon(latency)}・${pingTranslation(
              'latency',
            )}: \`${latency}\` ms\n\n${GetLatencyIcon(
              apiLatency,
            )}・${pingTranslation('apiLatency')}: \`${apiLatency}\` ms`,
            color: Number(globalEmbedLang('color')),
            image: {
              url: pingTranslation('imageUrl'),
            },
          },
        ],
      });
    } catch (error) {
      console.error('Error executing ping command:', error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

function GetLatencyIcon(currentLatency: number): string {
  if (currentLatency <= 99) {
    return '<:C3:1376192066975043585>';
  } else if (currentLatency <= 299) {
    return '<:C2:1376192003250983064>';
  } else if (currentLatency <= 599) {
    return '<:C1:1376191981956632716>';
  } else {
    return '<:C0:1376191946271228116>';
  }
}
