---
outline: deep
---

# Configuration

Resonix loads configuration from `resonix.toml` (automatically created on first run if absent) and environment variables overriding certain aspects.

## File Location

Looked up in the working directory as `resonix.toml` (lowercase) first, fallback `Resonix.toml`.

## Template

The template written on first run:

```toml
# (abbreviated – see source DEFAULT_CONFIG_TEMPLATE in src/config/mod.rs)
[server]
host = "0.0.0.0"
port = 2333
# password = "supersecret"

[logging]
clean_log_on_start = true

[resolver]
enabled = true
ytdlp_path = "yt-dlp"
# ffmpeg_path can be omitted; defaults to "ffmpeg"
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

## Sections

### `[server]`

| Key      | Type    | Default   | Description                                                               |
| -------- | ------- | --------- | ------------------------------------------------------------------------- |
| host     | string  | `0.0.0.0` | Bind address.                                                             |
| port     | number  | `2333`    | Bind port.                                                                |
| password | string? | unset     | If set, every request must include exact value in `Authorization` header. |

### `[logging]`

| Key                | Default | Description                                                            |
| ------------------ | ------- | ---------------------------------------------------------------------- |
| clean_log_on_start | true    | Truncate `.logs/latest.log` at startup. Logs always also go to stdout. |

### `[resolver]`

| Key                        | Default  | Description                                                      |
| -------------------------- | -------- | ---------------------------------------------------------------- |
| enabled                    | false    | Enable smart resolution/downloading for non-direct URLs.         |
| ytdlp_path                 | `yt-dlp` | Override binary path. Auto-download used if missing.             |
| ffmpeg_path                | `ffmpeg` | Override ffmpeg path. Auto-download attempted on Windows/Linux.  |
| timeout_ms                 | 20000    | Per resolve operation timeout.                                   |
| preferred_format           | `140`    | yt-dlp format spec for primary attempt (140 = m4a).              |
| allow_spotify_title_search | true     | If direct metadata resolution fails, attempt title-based search. |

### `[spotify]`

Set real credentials to enable Spotify track URL support. Values can directly be the credentials or environment variable names (indirection). Example:

```toml
[spotify]
client_id = "SPOTIFY_CLIENT_ID"   # Will read env var
client_secret = "SPOTIFY_CLIENT_SECRET"
```

### `[sources]`

Source allow/block lists implemented as regex. Matching performed against full URI AND hostname. Block patterns take precedence.

| Key     | Description                                                                         |
| ------- | ----------------------------------------------------------------------------------- |
| allowed | If non-empty only URIs/hosts matching any regex here are accepted (unless blocked). |
| blocked | Any match here rejects the URI.                                                     |

Example: allow only YouTube & direct local files, block SoundCloud.

```toml
[sources]
allowed = ["(^|.*)(youtube\\.com|youtu\\.be)(/|$)"]
blocked = ["(^|.*)soundcloud\\.com(/|$)"]
```

## Environment Overrides

| Variable                                  | Effect                                                           |
| ----------------------------------------- | ---------------------------------------------------------------- |
| RESONIX_RESOLVE                           | If set to `1`/`true` forces resolver enabled regardless of file. |
| YTDLP_PATH                                | Overrides `ytdlp_path`.                                          |
| FFMPEG_PATH                               | Overrides `ffmpeg_path`.                                         |
| RESOLVE_TIMEOUT_MS                        | Overrides `timeout_ms`.                                          |
| SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET | Provide Spotify credentials.                                     |

## Password Authentication

If `password` is set, every REST request must include:

```
Authorization: <password>
```

No scheme (e.g., `Bearer`) is required. A missing or mismatched header returns `401`.

## Logs

- Directory: `.logs/latest.log`
- Controlled by `clean_log_on_start`
- Structured human-friendly compact format (targets removed)

## Tool Cache

Auto-downloaded support tools stored in `~/.resonix/bin` (env var `RESONIX_TOOLS_DIR` exported for clarity). Binaries include `yt-dlp`, `ffmpeg`, `ffplay`, `ffprobe`.

Next: learn about the [Resolver](./resolver.md) or explore [Architecture](./architecture.md).
