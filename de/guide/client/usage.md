---
outline: deep
---

# Nutzung & Beispiele

Minimaler Discord Bot Slash Command zum Join & Abspielen eines Tracks:

::: tip

Damit die `index.js` Datei funktioniert, stelle sicher, dass du das `type` Feld wie folgt in deine `package.json` Datei hinzufügst:

```json
{
  "type": "module"
}
```

:::

::: code-group

```js [index.js]
import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Routes,
  REST,
} from "discord.js";
import { ResonixNode, ResonixManager } from "resonix.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const node = new ResonixNode({
  baseUrl: "http://localhost:2333",
  version: "v0",
  debug: true,
});
const manager = new ResonixManager(client, node);

client.on("interactionCreate", async (i) => {
  if (!i.isChatInputCommand()) return;
  if (i.commandName === "play") {
    const uri = i.options.getString("query", true); // direkt oder resolvierbar (Resolver aktiv?)
    const memberVc =
      i.guild?.members.me?.voice.channel ?? i.member.voice?.channel;
    if (!memberVc)
      return i.reply({
        content: "Join a voice channel first.",
        ephemeral: true,
      });
    const connection = await manager.join({
      guildId: i.guildId,
      voiceChannelId: memberVc.id,
      adapterCreator: i.guild.voiceAdapterCreator,
    });
    const player = await manager.create(i.guildId, connection);
    await player.play(uri);
    await i.reply(`Playing: ${uri}`);
  }
});

client.login(process.env.BOT_TOKEN);
```

```ts [index.ts]
import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Routes,
  REST,
} from "discord.js";
import { ResonixNode, ResonixManager } from "resonix.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const node = new ResonixNode({
  baseUrl: "http://localhost:2333",
  version: "v0",
  debug: true,
});
const manager = new ResonixManager(client, node);

client.on("interactionCreate", async (i) => {
  if (!i.isChatInputCommand()) return;
  if (i.commandName === "play") {
    const uri = i.options.getString("query", true); // direkt oder resolvierbar (Resolver aktiv?)
    const memberVc =
      i.guild?.members.me?.voice.channel ?? (i.member as any).voice?.channel;
    if (!memberVc)
      return i.reply({
        content: "Join a voice channel first.",
        ephemeral: true,
      });
    const connection = await manager.join({
      guildId: i.guildId!,
      voiceChannelId: memberVc.id,
      adapterCreator: (i.guild as any).voiceAdapterCreator,
    });
    const player = await manager.create(i.guildId!, connection);
    await player.play(uri);
    await i.reply(`Playing: ${uri}`);
  }
});

client.login(process.env.BOT_TOKEN);
```

:::

## Lautstärke

```ts
await player.setVolume(1.25); // 0.0 - 5.0 (server enforced)
```

## Pause / Fortsetzen

```ts
await player.pause();
await player.resume();
```

## Verlassen

```ts
await manager.leave(guildId);
```

## Mehrere Guilds

Der Manager hält einen `ResonixPlayer` pro Guild (Map nach Guild ID). Keine zusätzliche Einrichtung nötig.

## Logging / Debugging

Setze `debug: true` in den `ResonixNode` Optionen um erste Frame‑Energien, AudioPlayer Debug und WebSocket Ereignisse zu loggen.
