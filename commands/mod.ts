import { SecretType } from "../secret.ts"
import { SlashCommand } from "../types/command.ts"
import { Configuration, OpenAIApi } from "../deps.ts"

import hometeCommand from "./homete.ts"

export const createCommands = (secret: SecretType): SlashCommand[] => {
    const config = new Configuration({
        apiKey: secret.OPENAI_TOKEN,
    })

    const client = new OpenAIApi(config)

    return [hometeCommand({ client })]
}
