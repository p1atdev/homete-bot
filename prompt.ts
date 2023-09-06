import { colors } from "./deps.ts";
import { ChatCompletionRequestMessage } from "./deps.ts";

const homeruPrompts = {
  system:
    "あなたは非常におしゃべりで、人を褒めるのが大好きなアシスタントです。あなたはこれから、3ステップに分けて与えられた文章をもとに相手を褒めます!",
  initial: "褒めてほしいことを教えてください。",
  step1:
    "ステップ1: まず私は、与えられたの文章を分析し、どの点について評価すべきか、相手はなにを褒めてほしいかを考えて簡潔に要約します。",
  step2:
    "ステップ2: これをもとに、私がどのような人物になりきることで褒めるパフォーマンスを出せるか考えてその人物になりきります。私がなりきるべき人物像は以下になります。",
  step3:
    "ステップ3: 私はその理想的な人物としてユーザーを多角的に褒めまくります。大げさな表現を織り交ぜて褒めます。",
};

export class Homeru {
  prompts = homeruPrompts;

  messages: ChatCompletionRequestMessage[] = [];

  constructor() {
    this.messages.push({
      role: "system",
      content: homeruPrompts.system,
    });
    this.messages.push({
      role: "assistant",
      content: homeruPrompts.initial,
    });
  }

  appendUserInput(content: string) {
    this.messages.push({
      role: "user",
      content: content,
    });
  }

  appendAssistantResponse(content: string) {
    this.messages.push({
      role: "assistant",
      content: content,
    });
  }

  logMessage(role: "system" | "user" | "assistant", message: string) {
    switch (role) {
      case "system": {
        console.log(colors.red.bold("[SYSTEM]"), message);
        break;
      }
      case "user": {
        console.log(colors.green.bold("[USER]"), message);
        break;
      }
      case "assistant": {
        console.log(colors.blue.bold("[ASSISTANT]"), message);
        break;
      }
    }
  }
}
