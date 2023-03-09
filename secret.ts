import { loadSync } from "./deps.ts"

export const Secret = (path = "/.env") => {
    loadSync({
        export: true,
        envPath: path,
    })
    return {
        DISCORD_TOKEN: Deno.env.get("DISCORD_TOKEN")!,
        GUILD_ID: Deno.env.get("GUILD_ID")!,
        OPENAI_TOKEN: Deno.env.get("OPENAI_TOKEN")!,
    }
}

export type SecretType = ReturnType<typeof Secret>
