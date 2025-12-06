---
# Home page configuration (see https://vitepress.dev/reference/default-theme-home-page )
layout: home

hero:
  name: Resonix
  text: High‑performance relay-based audio node
  tagline: >
    Lightweight Rust audio core that decodes everything through ffmpeg, resolves YouTube / Spotify /
    SoundCloud via the Riva crate, and pushes PCM frames + events over low‑latency WebSockets.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: API Reference
      link: /api/reference
    - theme: alt
      text: WebSocket Stream
      link: /api/websocket
  image:
    src: https://resonix.dev/logo.png
    alt: Resonix logo

features:
  - icon: ⚡
    title: Minimal & Fast
    details: Pure Rust control plane backed entirely by ffmpeg for decoding, keeping real‑time PCM streaming predictable and resource friendly.
  - icon: 🔍
    title: Smart Resolver
    details: The resolver is powered by the `riva` extraction crate (no Python/yt-dlp) and can consume YouTube, SoundCloud, Spotify and `ytsearch:` queries.
  - icon: 🎛️
    title: Player Control API
    details: REST endpoints for creating players, managing queues, loop modes, metadata, filters and EQ.
  - icon: 📡
    title: Live Events
    details: Real‑time player state & lifecycle events (TrackStart, TrackEnd, QueueUpdate, LoopModeChange) via WebSocket.
  - icon: 🎚️
    title: Extensible Filters
    details: Per‑player volume & 15‑band parametric EQ with future space for DSP extensions.
  - icon: 📦
    title: Self‑Managed ffmpeg
    details: Prebuilt binaries plus an integrated ffmpeg bootstrapper download the latest BtbN build into `~/.resonix/bin` when the system lacks one.
---
