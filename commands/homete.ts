import { SlashCommand } from "../types/command.ts";
import {
  ApplicationCommandOptionTypes,
  InteractionResponseTypes,
  OpenAIApi,
} from "../deps.ts";
import { Homeru } from "../prompt.ts";
import { log } from "../log.ts";

interface Props {
  client: OpenAIApi;
}

const getHomeruMessage = async (client: OpenAIApi, content: string) => {
  const homeru = new Homeru();

  homeru.appendUserInput(content);
  homeru.appendAssistantResponse(homeru.prompts.step1); // 要約

  for (const message of homeru.messages) {
    homeru.logMessage(
      message.role,
      message.content,
    );
  }

  const step1 = await client.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: homeru.messages,
    max_tokens: 320,
    temperature: 0.7,
    top_p: 1,
  });

  const step1Message = step1.data.choices[0].message?.content;

  if (!step1Message) {
    throw new Error("step1Message is undefined");
  }

  homeru.appendAssistantResponse(step1Message);

  homeru.appendAssistantResponse(homeru.prompts.step2); // 人物像

  homeru.logMessage(
    "assistant",
    step1Message,
  );
  homeru.logMessage(
    "assistant",
    homeru.prompts.step2,
  );

  const step2 = await client.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: homeru.messages,
    max_tokens: 256,
    temperature: 0.7,
    top_p: 1,
  });

  const step2Message = step2.data.choices[0].message?.content;

  if (!step2Message) {
    throw new Error("step2Message is undefined");
  }

  homeru.appendAssistantResponse(step2Message);

  homeru.appendAssistantResponse(homeru.prompts.step3); // 褒める!!

  homeru.logMessage(
    "assistant",
    step2Message,
  );
  homeru.logMessage(
    "assistant",
    homeru.prompts.step3,
  );

  const step3 = await client.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: homeru.messages,
    max_tokens: 512,
    temperature: 1,
    top_p: 1,
  });

  const step3Message = step3.data.choices[0].message?.content;

  if (!step3Message) {
    throw new Error("step3Message is undefined");
  }

  homeru.appendAssistantResponse(step3Message);

  homeru.logMessage(
    "assistant",
    step3Message,
  );

  return step3Message;
};

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
      const data = interaction.data;
      if (!data) return;

      log.info("homete command called");

      const params: Record<string, any> = {};
      data.options?.forEach((option) => {
        if (!option.value) return;
        params[option.name] = option.value;
      });

      if (!params["content"]) return;

      // TODO: これを入力中の表示に変更する
      await b.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.DeferredChannelMessageWithSource,
          data: {
            content: "考え中...",
          },
        },
      );

      log.info("homete command: thinking...");

      const message = await getHomeruMessage(client, params["content"]);

      if (!message) {
        await b.helpers.editOriginalInteractionResponse(interaction.token, {
          content:
            "非常に申し訳ないのですが、上手く言葉にできなかったので、もう一度お願いします...",
        });
        return;
      }

      try {
        await b.helpers.editOriginalInteractionResponse(interaction.token, {
          content: message,
        });
        log.info("homete command: response sent");
      } catch (e) {
        log.error("homete command: error:", e);
        await b.helpers.editOriginalInteractionResponse(interaction.token, {
          content: "何かが上手くいかなかったみたい...もう一度お願いします...",
        });
        return;
      }
    },
    messageAction: async (b, m) => {
      const content = m.content.replace(/^!homete\s*/, "").replace(
        /^<@!?\d+>\s*/,
        "",
      );

      if (!content) return;
      log.info("homete command called (message)");

      const authorId = m.authorId;

      await b.helpers.triggerTypingIndicator(m.channelId);

      log.info("homete command: thinking...");

      const message = await getHomeruMessage(client, content);

      if (!message) {
        await b.helpers.sendMessage(m.channelId, {
          content:
            "非常に申し訳ないのですが、上手く言葉にできなかったので、もう一度お願いします...",
        });

        return;
      }

      try {
        await b.helpers.sendMessage(m.channelId, {
          content: `<@${authorId}> ${message}`,
        });
        log.info("homete command: response sent");
      } catch (e) {
        log.error("homete command: error:", e);
        await b.helpers.sendMessage(m.channelId, {
          content: "何かが上手くいかなかったみたい...もう一度お願いします...",
        });
        return;
      }
    },
  };
};
