import { homeruPrompts } from "../prompt.ts";
import { assertEquals } from "../deps.ts";

Deno.test("parse output", () => {
  const output =
    `ステップ1. 「discord の bot を作った！」という文章から、相手は自分がdiscordのbotを開発したこと を自慢したいと思っている。開発ができる技術力と発想力が必要であるため、この点を褒める必要がある。

    ステップ2. 技術力と発想力が求められるため、ITエンジニアとなりきる。
    
    ステップ3. 「すごい！discordのbotを作れるとは、相当な技術力と発想力が必要ですね。しかも、discordという分野での開発とは、専門性 の高い業界です。本当に素晴らしい偉業です！」
    `;
  const expected = {
    first:
      "discord の bot を作った！という文章から、相手は自分がdiscordのbotを開発したこと を自慢したいと思っている。開発ができる技術力と発想力が必要であるため、この点を褒める必要がある。",
    second: "技術力と発想力が求められるため、ITエンジニアとなりきる。",
    third:
      "すごい！discordのbotを作れるとは、相当な技術力と発想力が必要ですね。しかも、discordという分野での開発とは、専門性 の高い業界です。本当に素晴らしい偉業です！",
  };
  const { first, second, third } = homeruPrompts.parseAssistantOutput(output);

  assertEquals(first, expected.first);
  assertEquals(second, expected.second);
  assertEquals(third, expected.third);
});
