import { registerCommands } from "./commands.ts"
import { Bot } from "./deps.ts"
import { createCommands } from "./commands/mod.ts"
import { log } from "./log.ts"
import { SecretType } from "./secret.ts"

export const refreshCommands = async (bot: Bot, secret: SecretType) => {
    const commands = createCommands(secret)

    await registerCommands(bot, commands, secret.GUILD_ID)
}
