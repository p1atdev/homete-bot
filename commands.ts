import { Bot } from "./deps.ts";
import { log } from "./log.ts";
import { SlashCommand } from "./types/command.ts";

export const registerCommands = async (
  bot: Bot,
  commands: SlashCommand[],
  guildId?: string,
  global = false,
) => {
  log.info(
    "Commands:",
    commands.map((c) => c.command.name),
  );

  bot.events.interactionCreate = (b, interaction) => {
    const name = interaction.data?.name;
    if (!name) return;

    const command = commands.find((c) => c.command.name === name);
    if (!command) return;

    const action = command.action;
    if (!action) return;

    action(b, interaction);
  };

  bot.events.messageCreate = (b, message) => {
    const commandName = message.content.split(" ")[0];
    log.info("commandName:", commandName);

    if (message.content.startsWith(`<@${b.id}>`)) {
      // 特例で homeru コマンド
      const homete = commands.find((c) => c.command.name === "homete");
      if (!homete) return;

      const action = homete.messageAction;
      if (!action) return;

      action(b, message);
    } else {
      const command = commands.find((c) =>
        commandName === `!${c.command.name}`
      );
      if (!command) return;

      const action = command.messageAction;
      if (!action) return;

      log.info("do messageAction", commandName);

      action(b, message);
    }
  };

  log.info("Registered handling interactions");

  if (global) {
    log.info("Registering commands globally");

    await bot.helpers.upsertGlobalApplicationCommands(
      commands.map((c) => c.command),
    );

    log.info("Commands registered in global");
  } else {
    if (guildId) {
      log.info("Registering commands locally");

      await bot.helpers.upsertGuildApplicationCommands(
        guildId,
        commands.map((c) => c.command),
      );

      log.info("Registered commands in guild");
    }
  }
};
