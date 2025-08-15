---
# Startseiteneinstellungen (siehe https://vitepress.dev/reference/default-theme-home-page )
layout: home

hero:
  name: Resonix
  text: Hochperformanter Audio‑Node
  tagline: >
    Leichter Audio‑Node für Echtzeit‑Decoding, EQ / Filter, Queue & Loop‑Modi,
    erweiterbares Resolving (YouTube / Spotify / SoundCloud) und latenzarmes WebSocket‑Streaming.
  actions:
    - theme: brand
      text: Loslegen
      link: /de/guide/introduction
    - theme: alt
      text: API Referenz
      link: /de/api/reference
    - theme: alt
      text: WebSocket Stream
      link: /de/api/websocket
  image:
    src: https://raw.githubusercontent.com/resonix-dev/resonix-node/refs/heads/master/assets/app/exe.png
    alt: Resonix Logo

features:
  - icon: ⚡
    title: Minimal & Schnell
    details: Reiner Rust‑Kern mit Symphonia + optionalem ffmpeg‑Fallback für breite Codec‑Unterstützung; überträgt kompakte PCM‑Frames effizient über WebSockets.
  - icon: 🔍
    title: Intelligenter Resolver
    details: Optionaler, von yt-dlp + ffmpeg unterstützter Resolver/Downloader wandelt YouTube / Spotify / SoundCloud Links in direkt abspielbare Audiodateien um.
  - icon: 🎛️
    title: Player‑Steuerungs‑API
    details: REST Endpoints zum Erstellen von Playern, Verwalten von Queues, Loop‑Modi, Metadaten, Filtern und EQ.
  - icon: 📡
    title: Live‑Events
    details: Echtzeit‑Playerzustand & Lifecycle‑Events (TrackStart, TrackEnd, QueueUpdate, LoopModeChange) via WebSocket.
  - icon: 🎚️
    title: Erweiterbare Filter
    details: Pro Player Lautstärke & 15‑Band parametrischer EQ mit Platz für zukünftige DSP‑Erweiterungen.
  - icon: 📦
    title: Problemlos nutzbare Binaries
    details: Vorgebaute Binaries & automatischer Erststart‑Download von yt-dlp / ffmpeg (optional) halten die Einrichtung simpel.
---
