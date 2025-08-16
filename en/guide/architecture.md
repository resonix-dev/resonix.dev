---
outline: deep
---

# Architecture

This section dissects internal modules to help contributors and advanced integrators.

## Overview Diagram

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

## Release Artifact Architectures

Official build targets (v0.2.6) and typical characteristics:

| OS      | Arch    | Notes                                                 |
| ------- | ------- | ----------------------------------------------------- |
| Linux   | x86_64  | Baseline glibc build.                                 |
| Linux   | aarch64 | 64-bit ARM (Raspberry Pi 4/5 64-bit OS, ARM servers). |
| Linux   | armv7   | 32-bit ARM (older SBCs).                              |
| macOS   | aarch64 | Apple Silicon universal features compiled for ARM64.  |
| macOS   | x86_64  | Intel Macs.                                           |
| Windows | x86_64  | Standard 64-bit Windows (MSVC).                       |
| Windows | aarch64 | Windows on ARM (Surface Pro X, etc.).                 |

All archives bundle only the `resonix-node` executable (and any required license files). Resolver tools (`yt-dlp`, `ffmpeg`) are downloaded at runtime unless present.

## Module Responsibilities

| Module             | Responsibility                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `main.rs`          | Startup, logging, dependency check, router wiring, graceful shutdown.                         |
| `api::handlers`    | REST & WS handlers (player lifecycle, queue, decode helpers, resolver HTTP endpoint).         |
| `audio::player`    | Player state machine, decoding loop, filter application, queue & loop logic, event emission.  |
| `audio::decoder`   | Thin abstraction over Symphonia (and ffmpeg fallback via transcoding).                        |
| `audio::dsp`       | Volume + EQ filter maintenance and application.                                               |
| `audio::source`    | Local preparation of sources & fallback transcoding to MP3 if unsupported.                    |
| `resolver`         | Converting remote platform URLs to a local playable path or direct URL.                       |
| `config`           | Load/merge file + environment into `EffectiveConfig`. Regex compilation for source filtering. |
| `middleware::auth` | Optional password auth on all routes.                                                         |
| `state`            | Shared `AppState` container (players + config).                                               |
| `utils::tools`     | Auto-download of auxiliary binaries (yt-dlp, ffmpeg).                                         |

## Concurrency Model

- Each player runs inside an independent async task spawned at creation
- Inter-component signaling uses broadcast channels:
  - PCM frames: `out_tx` (buffer 1024 frames)
  - Pause/stop/skip: control channels (small buffers)
  - Events: `event_tx` broadcast JSON events
- Shared mutable structures (metadata, track info, queue, loop mode, filters) protected by async `Mutex`

## Audio Pipeline

1. Prepare source path (download or direct)
2. Attempt Symphonia decode
3. If codec unsupported -> transcode via ffmpeg -> reopen decoder
4. Produce PCM blocks, apply EQ & volume in-place
5. Chunk into 20ms frames (960 stereo samples @ 48k) = 3840 bytes per frame (16-bit interleaved)
6. Broadcast each frame via WebSocket channel

## Loop Modes

| Mode  | Behavior                                                      |
| ----- | ------------------------------------------------------------- |
| None  | Consume queue sequentially; stop after last track.            |
| Track | Repeat current track (unless skipped).                        |
| Queue | Rotate queue: pop front, push to back, continue indefinitely. |

## Event Model

`PlayerEvent` enum serialized to JSON:

```jsonc
{ "op": "TrackStart", "id": "player_id", "uri": "..." }
{ "op": "TrackEnd", "id": "player_id" }
{ "op": "QueueUpdate" }
{ "op": "LoopModeChange", "LoopModeChange": "track" } // (serde tag style may vary)
```

Subscribe via `GET /v0/players/{id}/events` (WebSocket).

## Frame Format

- 16-bit little endian signed PCM
- Interleaved stereo L,R
- 48_000 Hz
- Exactly 20ms per frame (960 samples _ 2 channels _ 2 bytes = 3840 bytes)
- Initial warmup message: currently a single silent frame (3840 zero bytes) for client buffer priming.

## Error Handling Philosophy

- Invalid client inputs: HTTP error codes (400, 401, 403, 404, 409)
- Internal/unexpected: 500 with minimal leakage (logs hold details)
- Resolver failures degrade gracefully: warns & fallback or returns 400 if unrecoverable

## Performance Considerations

- Frame broadcast uses broadcast channel; if consumers lag by > buffer size they drop frames (lag warning logged)
- EQ filters precomputed; applying is per-sample but optimized within current scope
- Avoids copying by reusing buffer & draining chunks; only serialize on broadcast

## Future Extensions

- Pluggable encoders (Opus) to reduce bandwidth
- Global mixing & multi-player mixing
- Adaptive bitrate / dynamic frame sizing
- Seek & timeline operations
