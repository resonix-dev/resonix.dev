---
outline: deep
---

# Konfiguration

Resonix lädt Einstellungen aus `resonix.toml` (wird beim ersten Start erzeugt) sowie Umgebungsvariablen, die einzelne Werte überschreiben.

## Dateipfad

Zuerst wird `resonix.toml` (klein geschrieben) im Working Directory gesucht, danach `Resonix.toml`.

## Vorlage

Beim ersten Start geschriebene Vorlage:

```toml
# (gekürzt – siehe DEFAULT_CONFIG_TEMPLATE in src/config/mod.rs)
[server]
host = "0.0.0.0"
port = 2333
# password = "supersecret"

[logging]
clean_log_on_start = true

[resolver]
enabled = true
ytdlp_path = "yt-dlp"
# ffmpeg_path optional; Standard "ffmpeg"
# timeout_ms = 20000
preferred_format = "140"
allow_spotify_title_search = true

[spotify]
client_id = "SPOTIFY_CLIENT_ID"
client_secret = "SPOTIFY_CLIENT_SECRET"

[sources]
allowed = []
blocked = []
```

## Sektionen

### `[server]`

| Schlüssel | Typ     | Standard  | Beschreibung                                                                        |
| --------- | ------- | --------- | ----------------------------------------------------------------------------------- |
| host      | string  | `0.0.0.0` | Bind Adresse                                                                        |
| port      | number  | `2333`    | Bind Port                                                                           |
| password  | string? | unset     | Falls gesetzt muss jeder Request den exakten Wert im `Authorization` Header senden. |

### `[logging]`

| Schlüssel          | Standard | Beschreibung                                                     |
| ------------------ | -------- | ---------------------------------------------------------------- |
| clean_log_on_start | true     | Kürzt `.logs/latest.log` beim Start. Logs zusätzlich auf stdout. |

### `[resolver]`

| Schlüssel                  | Standard | Beschreibung                                                      |
| -------------------------- | -------- | ----------------------------------------------------------------- |
| enabled                    | false    | Aktiviert intelligente Auflösung/Download für nicht-direkte URLs. |
| ytdlp_path                 | `yt-dlp` | Pfad überschreiben. Auto‑Download falls fehlend.                  |
| ffmpeg_path                | `ffmpeg` | Pfad überschreiben. Auto‑Download auf Windows/Linux.              |
| timeout_ms                 | 20000    | Timeout pro Auflösung.                                            |
| preferred_format           | `140`    | yt-dlp Format (140 = m4a).                                        |
| allow_spotify_title_search | true     | Titelbasierte Suche falls direkte Auflösung scheitert.            |

### `[spotify]`

Echte Zugangsdaten setzen um Spotify Track URLs zu unterstützen. Werte können direkt oder als Env‑Variablennamen angegeben werden.

```toml
[spotify]
client_id = "SPOTIFY_CLIENT_ID"
client_secret = "SPOTIFY_CLIENT_SECRET"
```

### `[sources]`

Allow/Block Listen als Regex. Abgleich gegen komplette URI UND Hostname. Block hat Vorrang.

| Schlüssel | Beschreibung                                                                    |
| --------- | ------------------------------------------------------------------------------- |
| allowed   | Wenn nicht leer, nur URIs/Hosts die ein Regex matchen (sofern nicht blockiert). |
| blocked   | Jeder Treffer blockiert die URI.                                                |

Beispiel: Nur YouTube & lokale Dateien erlauben, SoundCloud blockieren.

```toml
[sources]
allowed = ["(^|.*)(youtube\\.com|youtu\\.be)(/|$)"]
blocked = ["(^|.*)soundcloud\\.com(/|$)"]
```

## Environment Overrides

| Variable                                  | Effekt                                        |
| ----------------------------------------- | --------------------------------------------- |
| RESONIX_RESOLVE                           | Bei `1`/`true` erzwingt aktivierten Resolver. |
| YTDLP_PATH                                | Überschreibt `ytdlp_path`.                    |
| FFMPEG_PATH                               | Überschreibt `ffmpeg_path`.                   |
| RESOLVE_TIMEOUT_MS                        | Überschreibt `timeout_ms`.                    |
| SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET | Spotify Zugangsdaten.                         |

## Passwort Auth

Falls `password` gesetzt, jeder REST Request:

```
Authorization: <password>
```

Kein Schema nötig. Fehlend/falsch -> `401`.

## Logs

- Verzeichnis: `.logs/latest.log`
- Gesteuert durch `clean_log_on_start`
- Kompaktes menschenlesbares Format

## Tool Cache

Auto‑geladene Tools in `~/.resonix/bin` (Env `RESONIX_TOOLS_DIR`). Enthält `yt-dlp`, `ffmpeg`, `ffplay`, `ffprobe`.
