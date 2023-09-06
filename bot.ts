import { Bot, createBot, Intents, startBot } from "./deps.ts";
import { log } from "./log.ts";
import { SecretType } from "./secret.ts";
import { refreshCommands } from "./utils.ts";

export class HometeBot {
  private readonly secret: SecretType;
  private readonly bot: Bot;

  constructor(secret: SecretType) {
    const { DISCORD_TOKEN } = secret;
    this.secret = secret;
    this.bot = createBot({
      token: DISCORD_TOKEN,
      intents: Intents.MessageContent | Intents.GuildMessages,
    });
  }

  private setup = async () => {
    await refreshCommands(this.bot, this.secret);

    this.bot.events.ready = () => {
      log.success("Successfully connected to gateway");
    };
  };

  start = async () => {
    await this.setup();
    await startBot(this.bot);
  };
}
