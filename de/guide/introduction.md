---
outline: deep
---

# Einführung

Resonix ist ein leichter, selbstgehosteter Audio‑Node in Rust. Er liefert eine schlanke REST API und zwei
WebSocket Endpoints (PCM Frames + strukturierte Events), damit Bots und Backends Playback fernsteuern
können ohne eigene Decoder auszuschiffen. Seit v0.3 läuft die komplette Audio‑Pipeline über `ffmpeg` –
kein Symphonia, kein yt-dlp, keine Python Laufzeit. Ein integrierter Bootstrapper lädt bei Bedarf die
neueste statisch gelinkte BtbN ffmpeg Version nach `~/.resonix/bin`, falls auf dem System keine passende
Binary vorhanden ist.

Wesentliche Merkmale:

- **ffmpeg-first Decoding** – jeder Track wird über einen ffmpeg Prozess geöffnet, der 48 kHz Stereo
  PCM in den Resonix DSP Loop streamt. Wenn ffmpeg fehlt, kann der Server es automatisch herunterladen oder
  per `FFMPEG_PATH` auf eine eigene Binary zeigen.
- **Resolver auf Basis von `riva`** – YouTube, SoundCloud und Spotify URLs (inklusive `ytsearch:` Syntax)
  werden über das Rust `riva` Crate extrahiert. Kein yt-dlp erforderlich; Retries fokussieren sich auf
  Codec/Probe Fehler.
- **Queue‑bewusste Wiedergabe** – enqueute Tracks werden direkt aufgelöst, nötigenfalls zwischengespeichert
  und via `QueueUpdate` Events signalisiert, während der Player auf einer `Notify` blockiert statt zu
  busy-looping.
- **Latenzarme WebSockets** – PCM Frames verlassen den Server alle 20 ms (3840 Bytes) und ein zweiter
  WebSocket liefert JSON Events in Echtzeit.
- **Konfigurierbare Schutzmechanismen** – Allow/Block Regex, optionales Shared Password und Spotify
  Credential Checks regeln den Resolverzugriff.

## Kernkonzepte

| Konzept     | Beschreibung                                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Player      | Unabhängige Playback Pipeline (Decoder + DSP + Output Broadcast). Identifiziert durch frei gewählte ID.           |
| Track       | Abspielbare Quelle (lokaler Pfad oder direkte HTTP URL) oder Seiten‑URL die aufgelöst werden muss.                |
| Queue       | FIFO Liste kommender Tracks. Loop‑Modi ändern das Konsumverhalten.                                                |
| Resolver    | Optionales Modul das YouTube/SoundCloud/Spotify URLs oder `ytsearch:` Pseudo‑URLs in direkte Streams überführt.    |
| Filter / EQ | Laufzeit DSP pro Player (Lautstärke + 15‑Band EQ).                                                                |
| Events      | Strukturierte Nachrichten bei Lifecycle Änderungen.                                                               |
| Stream      | Binärer WebSocket Kanal mit 16‑Bit PCM Frames (20ms, 960 Samples \* 2 Kanäle).                                    |

## Wann Resonix nutzen?

Setze Resonix ein, wenn du:

- Deinen eigenen Decode + Playback Worker hosten möchtest statt externe SaaS Nodes zu integrieren
- Queues, Metadaten und DSP via HTTP kontrollieren willst, während deine Clients PCM empfangen
- YouTube/SoundCloud/Spotify Links ohne yt-dlp oder Python auflösen willst
- Möglichst geringe Deploy‑Reibung brauchst (Single Binary plus automatisch verwaltetes ffmpeg)

Nicht nötig bei rein statischer Dateiauslieferung oder wenn du komplexes Mixing/Transcoding brauchst
(steht auf der Roadmap, ist aber noch nicht umgesetzt).

## High Level Ablauf

1. Beim Start lädt Resonix `Resonix.toml`, generiert sie bei Bedarf und sorgt für eine ffmpeg Binary
  (Download nach `~/.resonix/bin`, sofern möglich). Alternativ setzt du `FFMPEG_PATH`.
2. Ein Client erstellt per `POST /v0/players` einen Player und übergibt optional Metadaten.
3. Der Server löst nicht‑direkte URLs über den Riva Resolver auf, erzeugt eine lokale Quelle (bei Remote
  HTTP temporäre Datei) und startet einen ffmpeg Decoder Task.
4. Clients abonnieren `GET /v0/players/{id}/ws` für PCM Frames und `GET /v0/players/{id}/events` für
  Lifecycle Events.
5. Weitere Tracks werden via `POST /v0/players/{id}/queue` angefügt; sie werden sofort resolved, damit die
  Wiedergabe ohne zusätzliche Wartezeit starten kann.
6. Loop Mode, Filter, Metadaten und Playback State lassen sich über dedizierte REST Endpoints anpassen. Wenn
  die Queue leer ist, wartet der Player blockierend auf neue Items.

## Feature Matrix

| Feature                      | Status                     |
| ---------------------------- | -------------------------- |
| Direkte Datei / HTTP Streams | Stable                     |
| Riva Resolver (YouTube/SC)   | Stable (opt‑in)            |
| Spotify Titel Suche          | Stable (Credentials nötig) |
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

- Binary schlank & reproduzierbar halten
- Starke Defaults liefern, aber Override via Env/Config erlauben
- Minimal gut dokumentierte Oberfläche für Client Libraries bieten
- Plattformunabhängig bleiben (Win/Linux/macOS)
*** End Patch
