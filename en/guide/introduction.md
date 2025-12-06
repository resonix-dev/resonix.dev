---
outline: deep
---

# Introduction

Resonix is a lightweight self‑hosted audio node written in Rust. It exposes a concise REST API and two
WebSocket endpoints (PCM frames + structured events) so that bots and backends can control playback
remotely without shipping native decoders. Starting with v0.3 the entire audio pipeline runs through
`ffmpeg`—no Symphonia, no yt-dlp, no Python runtime. A built-in bootstrapper can download the latest
statistically linked BtbN ffmpeg build into `~/.resonix/bin` whenever the system lacks a working binary.

Key characteristics:

- **ffmpeg-first decoding** – every track is opened by spawning ffmpeg and piping raw 48 kHz stereo
	PCM into Resonix’ DSP loop. If ffmpeg is missing the server can fetch it automatically or you can
	point `FFMPEG_PATH` at a custom build.
- **Resolver powered by `riva`** – YouTube, SoundCloud and Spotify URLs (plus `ytsearch:` syntaxes)
	are resolved via the Rust `riva` crate. No yt-dlp executable is required and retries target only
	codec/probe failures.
- **Queue-aware playback** – enqueued tracks are resolved up-front, cached if they became temporary
	files, and signalled via `QueueUpdate` events while the player blocks on a `Notify` instead of busy
	looping.
- **Low-latency WebSockets** – PCM frames are emitted at 20 ms cadence (3840 bytes each) while a
	dedicated WebSocket streaming JSON events keeps clients in sync.
- **Configurable safety rails** – allow/block regexes, optional shared password auth and Spotify
	credential checks guard resolver access.

## Core Concepts

| Concept      | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Player       | Independent playback pipeline (ffmpeg decoder + DSP + WebSocket broadcasters). You choose the ID when creating it.              |
| Track        | A playable source (local path or direct HTTP URL) or a platform URL that needs resolving when the resolver is enabled.          |
| Queue        | FIFO list of upcoming tracks per player. Loop modes decide how items cycle.                                                     |
| Resolver     | Optional module that converts YouTube/SoundCloud/Spotify URLs or `ytsearch:` pseudo URLs into direct audio streams.             |
| Filters / EQ | Per-player runtime DSP controls (volume + 15-band equalizer).                                                                   |
| Events       | JSON messages emitted on TrackStart, TrackEnd, QueueUpdate and LoopModeChange.                                                  |
| Stream       | Binary WebSocket channel broadcasting interleaved 16-bit PCM frames (20 ms, 960 samples * 2 channels).                          |

## When to Use Resonix

Resonix is useful when you want to:

- Host your own decode + playback worker instead of integrating third-party SaaS nodes
- Control queues, metadata and DSP via HTTP while streaming PCM into your own clients
- Resolve YouTube/SoundCloud/Spotify links without shipping yt-dlp or Python
- Keep deployment friction low (single binary plus automatically managed ffmpeg)

You might not need Resonix if you only serve static files or require multi-track mixing and complex
transcoding. Those are on the roadmap but not implemented yet.

## High Level Flow

1. On first launch Resonix loads `Resonix.toml`, generates it if missing, and ensures an ffmpeg binary
	 exists (downloading into `~/.resonix/bin` when possible). You can override the path via `FFMPEG_PATH`.
2. A client creates a player with `POST /v0/players` and optionally includes metadata.
3. The server resolves non-direct URLs via the Riva-backed resolver, prepares a local source (temporary
	 file for remote HTTP) and spawns an ffmpeg decoder task.
4. Clients subscribe to `GET /v0/players/{id}/ws` for PCM frames and `GET /v0/players/{id}/events` for
	 lifecycle events.
5. Additional tracks are appended via `POST /v0/players/{id}/queue`; they are resolved immediately so
	 playback can start without waiting for a download later.
6. Loop mode, filters, metadata and playback state are adjusted through dedicated REST endpoints. When the
	 queue drains the player idles on a `Notify` until a new track arrives.

## Feature Matrix

| Feature                               | Status                        |
| ------------------------------------- | ----------------------------- |
| Direct file / HTTP streaming          | Stable                        |
| Riva-powered resolver (YouTube/SC)    | Stable (opt-in)               |
| Spotify title search fallback         | Stable (requires credentials) |
| Queue & loop modes (none/track/queue) | Stable                        |
| WebSocket PCM streaming               | Stable                        |
| Player events WS channel              | Stable                        |
| Volume & EQ                           | Stable                        |
| Auth (shared password)                | Stable (basic)                |
| Multi-format output (opus)            | Planned                       |
| Precise seeking & duration            | Planned                       |
| Persisted queues                      | Planned                       |
| Metrics endpoint                      | Planned                       |
| Token based auth                      | Planned                       |

## Project Goals

- Keep the binary lean and reproducible
- Provide strong defaults while allowing overrides through env/config
- Offer a minimal, well-documented surface area for client libraries
- Stay platform agnostic (Windows, Linux, macOS)
