---
outline: deep
---

# Usage & Examples

Minimal Discord bot command to join & play a track:

```ts
import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Routes,
  REST,
} from "discord.js";
import { ResonixNode, ResonixManager } from "resonix";

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
    const uri = i.options.getString("query", true); // can be direct or resolvable (if server resolver enabled)
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

## Volume

```ts
await player.setVolume(1.25); // 0.0 - 5.0 (server enforced)
```

## Pause / Resume

```ts
await player.pause();
await player.resume();
```

## Leaving

```ts
await manager.leave(guildId);
```

## Multiple Guilds

The manager maintains one `ResonixPlayer` per guild (map keyed by guild id). No additional setup required.

## Logging / Debugging

Set `debug: true` in `ResonixNodeOptions` to log first few frame energies, audio player debug, and WebSocket events.

Next: see the [Client API Surface](./api.md).
