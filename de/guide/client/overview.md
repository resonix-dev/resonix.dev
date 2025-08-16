---
outline: deep
---

# Client Überblick (`resonix`)

`resonix` ist ein minimalistischer, meinungsstarker Node.js / TypeScript Client, um mit einem laufenden Resonix Audio Node zu interagieren und rohe PCM‑Frames via `@discordjs/voice` in Discord‑Voice Kanäle einzuspeisen.

Ziele:

- Sehr kleine API‑Fläche: join, Player erzeugen, play/pause/resume, Lautstärke
- Server übernimmt Decoding, Queue & Filterung
- Streaming roher 48kHz Stereo PCM Frames über den eingebauten WebSocket
- Framework‑agnostisch (funktioniert mit discord.js, aber nicht daran gebunden)

Nicht im Scope (DIY oder später): integrierte Track‑Queue Abstraktion, Such‑Helper, komplexe Reconnect Logik.

## Kernklassen

| Klasse           | Zweck                                                                         |
| ---------------- | ----------------------------------------------------------------------------- |
| `ResonixNode`    | Repräsentiert Zielserver (Basis‑URL + Version); hält gemeinsamen REST Client. |
| `ResonixManager` | Verwalten genau eines `ResonixPlayer` pro Discord Guild, Beitritt zu Voice.   |
| `ResonixPlayer`  | Brücke REST + WebSocket Audiostream -> Discord `AudioPlayer`.                 |

## Ablauf (High Level)

1. `ResonixNode` mit Server‑URL instanziieren (z. B. `http://localhost:2333`, Version `v0`).
2. `ResonixManager` erzeugen und deinem `discord.js` `Client` + Node übergeben.
3. Wenn ein Nutzer einen Play‑Befehl ausführt:
   - Voice Channel beitreten via `manager.join()`
   - Player holen/erstellen: `manager.create(guildId, connection)`
   - Wiedergabe starten: `player.play(uri)` (direkte oder resolvierbare URI)
4. Steuern mit `pause()`, `resume()`, `setVolume()`.
5. Aufräumen mit `manager.leave(guildId)` oder `player.destroy()`.

## Feature Zuordnung

| Server Fähigkeit  | Client Verantwortung                                                |
| ----------------- | ------------------------------------------------------------------- |
| Decoding / Filter | Komplett serverseitig                                               |
| Queue & Loop      | Server verwaltet Queue; Client kann (zukünftig) via REST hinzufügen |
| PCM Stream        | Client konsumiert Frames automatisch über WebSocket                 |
| Events            | (Geplant) – Events exponieren sobald Server API stabil ist          |

Weiter mit [Client Installation](./installation.md).
