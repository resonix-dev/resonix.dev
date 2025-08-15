---
outline: deep
---

# Resolver & Quellen

Der Resolver wandelt Seiten‑ oder Plattform‑URLs in direkt abspielbare Mediendateien (meist M4A oder MP3) um und speichert sie temporär.

## Unterstützte Plattformen

| Plattform          | Mechanismus                                             | Hinweise                                                   |
| ------------------ | ------------------------------------------------------- | ---------------------------------------------------------- |
| YouTube / youtu.be | `yt-dlp` Download im gewählten Formatcode               | Fallback auf allgemeinere Formatexpression bei Fehlschlag. |
| SoundCloud         | `yt-dlp` MP3 Extraktion oder direkte URL (`-g`)         | Mehrere Strategien vor Abbruch.                            |
| Spotify            | Spotify Web API (Metadata) + YouTube Suche via `yt-dlp` | Credentials erforderlich. Titel Heuristiken.               |

## Ablauf

1. Eingehende URI via `needs_resolve()` geprüft
2. Resolver aus: URI muss direkt sein
3. Resolver an: Plattformlogik versucht Download / Suche / Extraktion
4. Temporärer Dateipfad zurück; Decoder nutzt lokalen Pfad

## Formatwahl

`preferred_format` (Standard `140`) an `yt-dlp -f`. Bei Fehler Fallback: `bestaudio[ext=m4a]/bestaudio/best`.

## Spotify Auflösung

Zwei Schritte:

1. Track ID Extraktion (URL Segmente oder `spotify:track:<id>`). Metadata via API, dann `ytsearch1:"Artist - Title"`.
2. Fehlschlag & `allow_spotify_title_search` aktiv: Titel über `yt-dlp -e` + Suche.

## Caching Strategie

Derzeit: temporäre Datei je Auflösung (OS Temp). Zukunft: LRU Cache geplant.

## Source Allow/Block

Vor Auflösung oder Annahme direkter URIs erzwingt `is_uri_allowed()` die Regex Listen. Block hat Vorrang.

## Betriebshinweise

- Erhöht Latenz beim ersten Abspielen (Download/Transcode)
- Ausreichende Disk IO für temporäre Dateien
- Logs auf Warnungen achten (fehlende Spotify Daten)

## Fehlermodi

| Bedingung                                 | Ergebnis                            |
| ----------------------------------------- | ----------------------------------- |
| Nicht unterstützte Seite                  | 400 / Player Erstellung fehlschlägt |
| Resolver Timeout                          | Abbruch mit Fehler                  |
| Fehlende Spotify Credentials              | 400 bei Spotify URL                 |
| yt-dlp/ffmpeg fehlen & kein Auto-Download | Start schlägt fehl                  |
