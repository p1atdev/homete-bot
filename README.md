# 褒めて Bot

なんでも褒めてくれるアシスタントちゃん

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

![image](https://user-images.githubusercontent.com/60182057/223947691-b2622244-a5bf-4ca3-8a80-196f22fc0c9f.png)


![image](https://user-images.githubusercontent.com/60182057/223947623-7cd4ec54-5860-48fb-9463-65703b67914b.png)

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
  - スラッシュコマンドと `!` から始まるコマンドが使えます。`!homete` を使うと会話してる感がちょっと出ます。
