import { SlashCommand } from "../types/command.ts"
import { OpenAIApi, InteractionResponseTypes, ApplicationCommandOptionTypes } from "../deps.ts"
import { homeruPrompts } from "../prompt.ts"
import { log } from "../log.ts"

interface Props {
    client: OpenAIApi
}

export default ({ client }: Props): SlashCommand => {
    return {
        command: {
            name: "homete",
            description: "褒める！！",
            options: [
                {
                    type: ApplicationCommandOptionTypes.String,
                    name: "content",
                    description: "聞いてほしいこと",
                    required: true,
                },
            ],
        },
        action: async (b, interaction) => {
            const data = interaction.data
            if (!data) return

            log.info("homete command called")

            const params: Record<string, any> = {}
            data.options?.forEach((option) => {
                if (!option.value) return
                params[option.name] = option.value
            })

            if (!params["content"]) return

            await b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "考え中...",
                },
            })

            log.info("homete command: thinking...")

            const res = await client.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: homeruPrompts.system,
                    },
                    {
                        role: "user",
                        content: homeruPrompts.createUserInput(params["content"]),
                    },
                ],
                // stream: true,
                max_tokens: 512,
            })

            log.info("homete command: thinking done")
            log.info("homete command: response:", res.data.choices[0])

            const message = res.data.choices[0].message?.content

            if (!message) {
                await b.helpers.editOriginalInteractionResponse(interaction.token, {
                    content: "非常に申し訳ないのですが、上手く言葉にできなかったので、もう一度お願いします...",
                })
                return
            }

            log.info("homete command: message:", message)

            try {
                const results = homeruPrompts.parseAssistantOutput(message)

                await b.helpers.editOriginalInteractionResponse(interaction.token, {
                    content: results.third,
                })
            } catch (e) {
                log.error("homete command: error:", e)
                await b.helpers.editOriginalInteractionResponse(interaction.token, {
                    content: "何かが上手くいかなかったみたい...もう一度お願いします...",
                })
                return
            }
        },
        messageAction: async (b, m) => {
            const content = m.content.replace(/^!homete\s*/, "")

            if (!content) return
            log.info("homete command called (message)")

            const authorId = m.authorId

            const reply = await b.helpers.sendMessage(m.channelId, {
                content: "考え中...",
            })

            log.info("homete command: thinking...")

            const res = await client.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: homeruPrompts.system,
                    },
                    {
                        role: "user",
                        content: homeruPrompts.createUserInput(content),
                    },
                ],
                // stream: true,
                max_tokens: 512,
            })

            log.info("homete command: thinking done")
            log.info("homete command: response:", res.data.choices[0])

            const message = res.data.choices[0].message?.content

            if (!message) {
                await b.helpers.editMessage(reply.channelId, reply.id, {
                    content: "非常に申し訳ないのですが、上手く言葉にできなかったので、もう一度お願いします...",
                })

                return
            }

            log.info("homete command: message:", message)

            try {
                const results = homeruPrompts.parseAssistantOutput(message)

                await b.helpers.editMessage(reply.channelId, reply.id, {
                    content: `<@${authorId}> ${results.third}`,
                })
            } catch (e) {
                log.error("homete command: error:", e)
                await b.helpers.editMessage(reply.channelId, reply.id, {
                    content: "何かが上手くいかなかったみたい...もう一度お願いします...",
                })
                return
            }
        },
    }
}
