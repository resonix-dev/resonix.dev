---
outline: deep
---

# Client Overview (`resonix`)

`resonix` is a minimal, opinionated Node.js / TypeScript client for interacting with a running Resonix audio node and piping raw PCM frames into Discord voice (via `@discordjs/voice`).

Goals:

- Tiny surface: join, create player, play/pause/resume, volume
- Leverage server for decoding, queue & filtering
- Stream raw 48kHz stereo PCM frames over the built‑in WebSocket
- Stay framework agnostic (works with discord.js but not tied to it)

Out of scope (DIY or future): integrated track queue abstraction, search helpers, complex reconnection logic.

## Core Classes

| Class            | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `ResonixNode`    | Represents a target server (base URL + version); holds REST client. |
| `ResonixManager` | Manages one `ResonixPlayer` per Discord guild, joining voice.       |
| `ResonixPlayer`  | Bridges REST + WebSocket stream into a Discord AudioPlayer.         |

## High Level Flow

1. Instantiate `ResonixNode` with server URL (e.g. `http://localhost:2333`, version `v0`).
2. Create a `ResonixManager` and pass your `discord.js` `Client` + node.
3. When a user invokes a play command:
   - Join voice channel via `manager.join()`
   - Create/get player: `manager.create(guildId, connection)`
   - Start playback: `player.play(uri)` (direct or resolvable URI)
4. Control with `pause()`, `resume()`, `setVolume()`.
5. Destroy with `manager.leave(guildId)` or `player.destroy()`.

## Feature Mapping

| Server Capability  | Client Responsibility                                  |
| ------------------ | ------------------------------------------------------ |
| Decoding / Filters | Handled entirely server‑side                           |
| Queue & Loop       | Server manages queue; client can add via REST (future) |
| PCM Stream         | Client consumes frames via WebSocket automatically     |
| Events             | (Planned) expose events once server API stabilized     |

Continue with [Client Installation](./installation.md).
