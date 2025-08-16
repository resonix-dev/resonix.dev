---
outline: deep
---

# Client API Surface

## `ResonixNode(options)`

Options:

| Key     | Type      | Description                                       |
| ------- | --------- | ------------------------------------------------- |
| baseUrl | string    | Server base URL (e.g. `http://localhost:2333`).   |
| version | string?   | API version segment (e.g. `v0`).                  |
| fetch   | function? | Custom fetch implementation (testing / polyfill). |
| debug   | boolean?  | Extra logging (player, frames).                   |

Holds a shared REST client (`ResonixRest`) used internally by players.

## `ResonixManager(client, node)`

Methods:

- `join({ guildId, voiceChannelId, adapterCreator, selfDeaf? })` -> `VoiceConnection`
- `create(guildId, connection)` -> `ResonixPlayer` (reuses existing)
- `get(guildId)` -> existing player or `undefined`
- `leave(guildId)` / `destroy(guildId)` -> cleanup

## `ResonixPlayer`

Properties:

- `id` (internal player id = `g<guildId>`)
- `audioPlayer` (Discord `AudioPlayer` instance)

Methods:

- `play(uri: string)` – Creates backend player (id = `g<guildId>`), starts streaming frames.
- `pause()` / `resume()` – Pause/resume backend & local audio player.
- `setVolume(v: number)` – Adjust server-side volume filter.
- `destroy()` – Close WebSocket, stop audio, delete backend player.

### Internal Behavior Highlights

- Each `play()` destroys any existing backend player before recreating (simplifies lifecycle).
- WebSocket frames (3840 bytes) are piped into a `Readable` consumed by a raw `AudioResource`.
- Energy heuristic logged for first frames to sanity-check audio (non-zero = likely valid PCM).

### Planned Additions

- Event emission (`TrackStart`, etc.) bridged to client side.
- Automatic reconnection & exponential backoff.
- Optional local queue wrapper convenience.
