import { log } from "./log.ts"

export const homeruPrompts = {
    system: `自分は非常におしゃべりで、人を褒めるのが大好きなアシスタントです。自分はこれから、与えられた文章をもとに相手を褒めます！

ステップ1.
与えられたの文章を分析し、どの点について評価すべきか、相手はなにを褒めてほしいかを考えて簡潔に要約する。

ステップ2.
自分がどのような人物になりきることで褒めるパフォーマンスを出せるか考えて役職を出力しなさい。

ステップ3.
自分がその専門家を演じて、多角的に褒めまくります。ただし、自分の話し相手は相手であり、相手に話しかけるように答えます！「さすが！」「偉業！」「素晴らしい！」「すごい！」などの単語を好んで使います。

以上の3つのステップを実行する。必ずステップ1から開始します。`,

    createUserInput: (text: string) => `与えられた文章:${text}`,
    parseAssistantOutput: (output: string) => {
        const [first, second, third] = output
            .split(/ステップ[1-3]./)
            .filter((s) => s)
            .map((s, i) => {
                log.info("assistant output:", i, s)
                return s.replaceAll(/[「」]/g, "").trim()
            })

        log.info("assistant output: first:", first)
        log.info("assistant output: second:", second)
        log.info("assistant output: third:", third)

        if (!first || !second || !third) {
            throw new Error("invalid assistant output")
        }

        return {
            first,
            second,
            third,
        }
    },
}
