# 褒めて Bot

なんでも褒めてくれるアシスタントちゃん

![sample screenshot](./screeenshots/sample.jpg)

## 必要なもの

- Deno
- Discord Bot のトークン
- OpenAI の API キー

`.env.example` をコピーして `.env` を作成し、それぞれを入力してください。

```bash
DISCORD_TOKEN=
GUILD_ID=
OPENAI_TOKEN=
```

### Discord bot の権限

メッセージの内容を読むコマンドがあるため、最低限以下の権限が必要です。

![intents](./screeenshots/intents.jpg)

![permissions](./screeenshots/permissions.jpg)

この権限で招待する場合はこのようなリンクになります。

```
https://discord.com/api/oauth2/authorize?client_id={botのid}&permissions=2147486720&scope=bot
```

## 実行

プロジェクトのルートディレクトリで以下を実行します

```
deno task start
```

## コマンド

コマンドは現在以下のものがあります

- `homete`
  - スラッシュコマンドと `!` から始まるコマンドが使えます。`!homete`
    を使うと会話してる感がちょっと出ます。
  - また、BOT に直接 @ でメンションしても褒めてくれます。(最初の画像)
