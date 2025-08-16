---
outline: deep
---

# Client API Oberfläche

## `ResonixNode(options)`

Optionen:

| Schlüssel | Typ       | Beschreibung                                      |
| --------- | --------- | ------------------------------------------------- |
| baseUrl   | string    | Server Basis‑URL (z. B. `http://localhost:2333`). |
| version   | string?   | API Versionssegment (z. B. `v0`).                 |
| fetch     | function? | Eigenes Fetch (Tests / Polyfill).                 |
| debug     | boolean?  | Zusätzliche Logs (Player, Frames).                |

Gemeinsamer REST Client (`ResonixRest`) wird intern genutzt.

## `ResonixManager(client, node)`

Methoden:

- `join({ guildId, voiceChannelId, adapterCreator, selfDeaf? })` -> `VoiceConnection`
- `create(guildId, connection)` -> `ResonixPlayer` (nutzt vorhandenen wieder)
- `get(guildId)` -> existierender Player oder `undefined`
- `leave(guildId)` / `destroy(guildId)` -> Entfernen / Aufräumen

## `ResonixPlayer`

Eigenschaften:

- `id` (interne Player ID = `g<guildId>`)
- `audioPlayer` (Discord `AudioPlayer` Instanz)

Methoden:

- `play(uri: string)` – Erstellt Backend Player (ID = `g<guildId>`), startet Stream.
- `pause()` / `resume()` – Pausiert / setzt fort (Server + lokal).
- `setVolume(v: number)` – Setzt serverseitigen Volume Filter.
- `destroy()` – Schließt WebSocket, stoppt Audio, löscht Backend Player.

### Interne Verhalten Highlights

- Jedes `play()` zerstört ggf. vorhandenen Backend Player für einen einfachen Lifecycle.
- WebSocket Frames (3840 Bytes) -> `Readable` -> Raw `AudioResource`.
- Energie Heuristik für erste Frames (Sanity Check auf Audio).

### Geplante Erweiterungen

- Ereignisse (`TrackStart`, etc.) an Client weiterreichen.
- Automatischer Reconnect mit Backoff.
- Optionale lokale Queue Abstraktion.