---
outline: deep
---

# Einführung

Resonix ist ein leichter selbstgehosteter Audio‑Node in Rust. Er stellt eine REST API sowie Echtzeit WebSocket Streams für latenzarme Audioübertragung und Player‑Lifecycle Events bereit. Ziel ist eine ergonomische moderne Alternative für Musik / Radio / Voice Anwendungsfälle (z. B. Discord Musikbots, kollaborative Playlists, Dashboards oder eigene Streaming Backends):

- Minimale Laufzeitabhängigkeiten (reines Rust Decoding via [Symphonia] mit optionalem ffmpeg Fallback)
- Optionaler intelligenter Resolver/Downloader für YouTube / Spotify / SoundCloud per `yt-dlp`
- Pro Player Queues, Loop‑Modi, Lautstärke & Multi‑Band EQ
- Echtzeit Streaming von PCM Frames (Stereo 48kHz 20ms Frames) via WebSocket
- Event Broadcast Kanal (TrackStart, TrackEnd, QueueUpdate, LoopModeChange)
- Konfigurierbare Allow/Block Regex Muster & Authentifizierung

## Kernkonzepte

| Konzept     | Beschreibung                                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Player      | Unabhängige Playback Pipeline (Decoder + DSP + Output Broadcast). Identifiziert durch frei gewählte ID.           |
| Track       | Abspielbare Quelle (lokaler Pfad oder direkte HTTP URL) oder Seiten‑URL die aufgelöst werden muss.                |
| Queue       | FIFO Liste kommender Tracks. Loop‑Modi ändern das Konsumverhalten.                                                |
| Resolver    | Optionales Modul das YouTube/Spotify/SoundCloud URLs (oder Spotify Track IDs) in direkte Mediendateien umwandelt. |
| Filter / EQ | Laufzeit DSP pro Player (Lautstärke + 15‑Band EQ).                                                                |
| Events      | Strukturierte Nachrichten bei Lifecycle Änderungen.                                                               |
| Stream      | Binärer WebSocket Kanal mit 16‑Bit PCM Frames (20ms, 960 Samples \* 2 Kanäle).                                    |

## Wann Resonix nutzen?

Wenn du:

- Einen eigenen Audio Processing & Streaming Node hosten willst
- Queues & Metadaten programmatisch via HTTP steuern möchtest
- Basis DSP (Volume / EQ) Server‑seitig anwenden willst
- Externe Plattformlinks zu Direkt‑Audio auflösen und temporär cachen möchtest
- Über einfache REST + WS Protokolle integrieren willst

Nicht nötig bei rein statischer Dateiauslieferung oder wenn komplexes Transcoding / Mixing / Multi‑Output Routing nötig ist (Roadmap).

## High Level Ablauf

1. (Optional) Resolver aktivieren; erster Lauf stellt `yt-dlp` / `ffmpeg` sicher.
2. Client sendet `POST /v0/players` mit URI & optionalen Metadaten.
3. Server startet Task: Auflösen (falls nötig), Download/Transcode, Decoding, Filter anwenden & Frames broadcasten.
4. Client verbindet `GET /v0/players/{id}/ws` (PCM Frames) und optional `.../{id}/events` (JSON Events).
5. Weitere Tracks via `POST /v0/players/{id}/queue`.
6. Loop Mode & Filter jederzeit änderbar.

## Feature Matrix

| Feature                      | Status                     |
| ---------------------------- | -------------------------- |
| Direkte Datei / HTTP Streams | Stable                     |
| yt-dlp + ffmpeg Resolver     | Stable (opt‑in)            |
| Spotify Titel->YouTube Suche | Stable (Credentials nötig) |
| Queue & Loop Modi            | Stable                     |
| WebSocket PCM Streaming      | Stable                     |
| Player Events WS Kanal       | Stable                     |
| Volume & EQ                  | Stable                     |
| Auth (Shared Password)       | Stable (Basic)             |
| Multi‑Format Output (Opus)   | Geplant                    |
| Präzises Seeking & Dauer     | Geplant                    |
| Persistente Queues           | Geplant                    |
| Metrics Endpoint             | Geplant                    |
| Tokenbasierte Auth           | Geplant                    |

## Projektziele

- Binary schlank & schnell halten
- Zero‑Config Defaults mit hilfreichen Warnungen
- Minimal stabile Oberfläche für Client Libraries
- Plattformunabhängig bleiben (Win/Linux/macOS)

[Symphonia]: https://github.com/pdeljanov/Symphonia
