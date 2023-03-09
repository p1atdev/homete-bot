import { Bot, CreateSlashApplicationCommand, Interaction, Message } from "../deps.ts"

export interface SlashCommand {
    command: CreateSlashApplicationCommand
    action: (bot: Bot, interaction: Interaction) => void
    messageAction?: (bot: Bot, message: Message) => void
}
