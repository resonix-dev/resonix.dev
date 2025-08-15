---
outline: deep
---

# Introduction

Resonix is a lightweight self‑hosted audio node written in Rust. It exposes a REST API and real‑time WebSocket streams for low‑latency audio delivery and player lifecycle events. It aims to be an ergonomic, modern alternative for building music / radio / voice experiences (e.g. Discord music bots, collaborative playlists, dashboards, or custom streaming backends) with:

- Minimal runtime dependencies (pure Rust decoding via [Symphonia] with optional ffmpeg fallback)
- Optional smart resolver/downloader for YouTube / Spotify / SoundCloud using `yt-dlp`
- Per‑player queues, loop modes, volume & multi‑band EQ
- Real‑time streaming of PCM frames (stereo 48kHz 20ms frames) over WebSocket
- Event broadcast channel (TrackStart, TrackEnd, QueueUpdate, LoopModeChange)
- Configurable source allow/block regex patterns & authentication

## Core Concepts

| Concept      | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Player       | Independent playback pipeline (decoder + DSP + output broadcaster). Identified by a caller‑supplied ID when created.            |
| Track        | A playable audio source (local file path or direct HTTP URL) or a page URL that must be resolved when the resolver is enabled.  |
| Queue        | FIFO list of upcoming tracks for a player. Loop modes change how queue consumption behaves.                                     |
| Resolver     | Optional module that converts YouTube/Spotify/SoundCloud page URLs (or Spotify track IDs) into direct downloadable media files. |
| Filters / EQ | Per‑player runtime DSP controls (volume + 15‑band equalizer).                                                                   |
| Events       | Structured messages emitted on player lifecycle changes.                                                                        |
| Stream       | Binary WebSocket channel broadcasting interleaved 16‑bit PCM frames (20ms, 960 samples \* 2 channels).                          |

## When to Use Resonix

Use Resonix if you need to:

- Host your own audio processing & streaming node instead of relying on a SaaS
- Control queues & metadata programmatically via HTTP
- Apply basic DSP (volume / EQ) server side
- Resolve external platform links to direct audio while caching the result temporarily
- Integrate with Node.js or other clients over simple REST + WS protocols

You might not need Resonix if you only serve static files or require advanced transcoding / mixing / multi‑output routing (future roadmap).

## High Level Flow

1. (Optional) Enable resolver; first run ensures `yt-dlp` / `ffmpeg` are present (auto download if missing).
2. Client sends `POST /v0/players` with an initial URI (direct or resolvable) and optional metadata.
3. Server spawns a player task which resolves (if needed), downloads/transcodes, decodes frames, applies filters & broadcasts them to subscribed WebSocket clients.
4. Client connects to `GET /v0/players/{id}/ws` to receive binary PCM frames, and optionally `GET /v0/players/{id}/events` for JSON event messages.
5. Additional tracks are enqueued via `POST /v0/players/{id}/queue`.
6. Loop mode & filters can be adjusted at runtime.

## Feature Matrix

| Feature                               | Status                        |
| ------------------------------------- | ----------------------------- |
| Direct file / HTTP streaming          | Stable                        |
| yt-dlp + ffmpeg resolver              | Stable (opt‑in)               |
| Spotify title->YouTube search         | Stable (requires credentials) |
| Queue & loop modes (none/track/queue) | Stable                        |
| WebSocket PCM streaming               | Stable                        |
| Player events WS channel              | Stable                        |
| Volume & EQ                           | Stable                        |
| Auth (shared password)                | Stable (basic)                |
| Multi‑format output (opus)            | Planned                       |
| Precise seeking & duration            | Planned                       |
| Persisted queues                      | Planned                       |
| Metrics endpoint                      | Planned                       |
| Token based auth                      | Planned                       |

## Project Goals

- Keep binary clean and fast
- Prefer zero‑config defaults that still log actionable warnings
- Provide a minimal stable surface area for client libraries
- Remain platform agnostic (Windows, Linux, macOS)

Next: continue with [Installation](./installation.md).

[Symphonia]: https://github.com/pdeljanov/Symphonia
