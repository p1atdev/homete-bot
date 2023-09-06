import { HometeBot } from "./bot.ts";
import { Secret } from "./secret.ts";

const bot = new HometeBot(Secret("./.env.local"));

await bot.start();
