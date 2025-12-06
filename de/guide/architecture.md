---
outline: deep
---

# Architektur

Dieser Abschnitt zerlegt interne Module für Beitragende und fortgeschrittene Integratoren.

## Überblicksdiagramm

```
+-------------+        HTTP (REST)        +-------------------+
|  Client(s)  | <-----------------------> | Axum Router       |
+-------------+                           |  /v0/... endpoints |
        |                                  +-------------------+
        | WebSocket (binary PCM / events)             |
        v                                            (State)
+----------------+      async tasks       +--------------------------+
| Player (N)     | ---------------------> | AppState (DashMap)       |
| - Decoder      | subscribe() frames     | - players (Arc<Player>)  |
| - DSP Filters  | event_tx() events      | - cfg (Arc<Effective... )|
| - Queue        |                        +--------------------------+
| - Loop Mode    |                                |
+----------------+                                v
      |                               +---------------------------+
      | open() / fallback             | Resolver (yt-dlp/ffmpeg) |
      v                               +---------------------------+
 Symphonia Decoder
```

## Release‑Artefakt Architekturen

Offizielle Build‑Ziele (v0.3.0) und typische Merkmale:

| OS      | Arch    | Hinweise                                   |
| ------- | ------- | ------------------------------------------ |
| Linux   | x86_64  | Basis glibc Build.                         |
| Linux   | aarch64 | 64‑Bit ARM (Raspberry Pi 4/5, ARM Server). |
| Linux   | armv7   | 32‑Bit ARM (ältere SBCs).                  |
| macOS   | aarch64 | Apple Silicon.                             |
| macOS   | x86_64  | Intel Macs.                                |
| Windows | x86_64  | Standard 64‑Bit Windows (MSVC).            |
| Windows | aarch64 | Windows on ARM.                            |

Archive enthalten nur das `resonix-node` Executable (plus Lizenzdateien). Resolver‑Tools (`yt-dlp`, `ffmpeg`) werden zur Laufzeit geladen, falls nicht vorhanden.

## Modulverantwortungen

| Modul              | Aufgabe                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| `main.rs`          | Start, Logging, Abhängigkeitscheck, Router, sauberer Shutdown.                    |
| `api::handlers`    | REST & WS Handler (Lifecycle, Queue, Decode, Resolver Endpoint).                  |
| `audio::player`    | Player State Machine, Decoding Loop, Filteranwendung, Queue & Loop Logik, Events. |
| `audio::decoder`   | Abstraktion über Symphonia (+ ffmpeg Fallback).                                   |
| `audio::dsp`       | Lautstärke + EQ Verwaltung & Anwendung.                                           |
| `audio::source`    | Quellen vorbereiten & Fallback Transcoding zu MP3.                                |
| `resolver`         | Plattform‑URLs in lokale abspielbare Pfade/URLs wandeln.                          |
| `config`           | Datei + Umgebung laden/mergen in `EffectiveConfig`. Regex Kompilierung.           |
| `middleware::auth` | Optionale Passwortauth auf allen Routen.                                          |
| `state`            | Gemeinsamer `AppState` Container (Player + Config).                               |
| `utils::tools`     | Auto‑Download von Hilfsbinaries.                                                  |

## Nebenläufigkeitsmodell

- Jeder Player läuft in eigener async Task
- Kommunikation via Broadcast Channels:
  - PCM Frames: `out_tx` (Puffer 1024 Frames)
  - Pause/Stop/Skip: Kontrollkanäle (kleine Puffer)
  - Events: `event_tx` JSON Events
- Gemeinsame mutierbare Strukturen durch async `Mutex` geschützt

## Audio Pipeline

1. Quellpfad vorbereiten (Download oder direkt)
2. Symphonia Decode versuchen
3. Falls Codec nicht unterstützt -> ffmpeg Transcode -> Decoder erneut öffnen
4. PCM Blöcke erzeugen, EQ & Lautstärke anwenden
5. In 20ms Frames (960 Stereo Samples @48k) zerteilen = 3840 Bytes
6. Jeden Frame broadcasten

## Loop Modi

| Modus | Verhalten                                        |
| ----- | ------------------------------------------------ |
| None  | Queue sequenziell, stoppt nach letztem Track.    |
| Track | Aktueller Track wiederholt (außer geskippt).     |
| Queue | Queue rotieren: vorn entnehmen, hinten anhängen. |

## Eventmodell

`PlayerEvent` serialisiert zu JSON:

```jsonc
{ "op": "TrackStart", "id": "player_id", "uri": "..." }
{ "op": "TrackEnd", "id": "player_id" }
{ "op": "QueueUpdate" }
{ "op": "LoopModeChange", "LoopModeChange": "track" }
```

Subscription via `GET /v0/players/{id}/events`.

## Frame Format

- 16‑Bit Little Endian PCM
- Interleaved Stereo L,R
- 48.000 Hz
- Exakt 20ms pro Frame (960*2*2 = 3840 Bytes)
- Initial: ein stiller Frame zum Aufwärmen

## Fehlerphilosophie

- Ungültige Eingaben: 400, 401, 403, 404, 409
- Intern: 500 (Details nur in Logs)
- Resolver Fehler degradieren: Warnung & Fallback oder 400

## Performance

- Broadcast Channel: bei Lag > Puffer Frames Drop (Warnung)
- EQ vorausberechnet; Anwendung pro Sample innerhalb Scope optimiert
- Kopien vermeiden durch Pufferwiederverwendung

## Zukünftige Erweiterungen

- Austauschbare Encoder (Opus)
- Globales & Multi‑Player Mixing
- Adaptive Bitrate / dynamische Framegröße
- Seek & Timeline
