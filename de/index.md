---
# Startseiteneinstellungen (siehe https://vitepress.dev/reference/default-theme-home-page )
layout: home

hero:
  name: Resonix
  text: Hochleistungs Relay-basierter Audio-Node
  tagline: >
    Leichter Rust Audio‑Kern, der alles durch ffmpeg dekodiert, YouTube / Spotify / SoundCloud
    über die Riva‑Bibliothek auflöst und PCM Frames + Events über latenzarme WebSockets sendet.
  actions:
    - theme: brand
      text: Loslegen
      link: /de/guide/
    - theme: alt
      text: API Referenz
      link: /de/api/reference
    - theme: alt
      text: WebSocket Stream
      link: /de/api/websocket
  image:
    src: https://resonix.dev/logo.png
    alt: Resonix Logo

features:
  - icon: ⚡
    title: Minimal & Schnell
    details: Reiner Rust‑Kontrollpfad, der vollständig auf ffmpeg zum Dekodieren setzt und damit vorhersagbares, ressourcenschonendes PCM‑Streaming ermöglicht.
  - icon: 🔍
    title: Intelligenter Resolver
    details: Der Resolver basiert auf der `riva`‑Extraktionsbibliothek (kein Python/yt-dlp) und versteht YouTube und SoundCloud‑Abfragen. Spotify‑URLs werden über die offizielle API aufgelöst.
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
    title: Selbstverwaltetes ffmpeg
    details: Vorgebaute Binaries plus integrierter ffmpeg‑Bootstrapper laden die neueste BtbN‑Version in `~/.resonix/bin`, wenn kein System‑Binary vorhanden ist.
---
