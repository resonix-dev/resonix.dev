---
# Home page configuration (see https://vitepress.dev/reference/default-theme-home-page )
layout: home

hero:
  name: Resonix
  text: High‑performance audio node
  tagline: >
    Lightweight audio node for real‑time audio decoding, EQ/filters, queue & loop modes,
    pluggable resolving (YouTube / Spotify / SoundCloud) and low‑latency WebSocket streaming.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: API Reference
      link: /api/reference
    - theme: alt
      text: WebSocket Stream
      link: /api/websocket
  image:
    src: https://raw.githubusercontent.com/resonix-dev/resonix-node/refs/heads/master/assets/app/exe.png
    alt: Resonix logo

features:
  - icon: ⚡
    title: Minimal & Fast
    details: Pure Rust core using Symphonia + optional ffmpeg fallback for broad codec support; streams opus‑size PCM frames efficiently over WebSockets.
  - icon: 🔍
    title: Smart Resolver
    details: Optional yt-dlp + ffmpeg powered resolver/downloader converts YouTube / Spotify / SoundCloud links to direct playable audio.
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
    title: Zero‑Hassle Binaries
    details: Prebuilt binaries & automatic first‑run download of yt-dlp / ffmpeg (optional) keep setup simple.
---
