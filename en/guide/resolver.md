---
outline: deep
---

# Resolver & Sources

The resolver converts high-level page or platform URLs into direct playable media files (usually M4A or MP3) and stores them temporarily on disk.

## Supported Platforms

| Platform           | Mechanism                                                      | Notes                                                         |
| ------------------ | -------------------------------------------------------------- | ------------------------------------------------------------- |
| YouTube / youtu.be | `yt-dlp` download using chosen format code                     | Falls back to a broader format expression if preferred fails. |
| SoundCloud         | `yt-dlp` MP3 extraction or direct URL fetch (`-g`)             | Multiple strategies before error.                             |
| Spotify            | Spotify Web API (track metadata) + YouTube search via `yt-dlp` | Requires credentials. Title fallback heuristics.              |

## Flow

1. Incoming URI checked with `needs_resolve()` (hostname pattern match)
2. If resolver disabled: URI must already be a direct HTTP/file path
3. If enabled: platform-specific logic attempts a direct download / search / extraction
4. Temporary file path returned; decoding uses local path

## Format Selection

`preferred_format` (default `140`) is passed to `yt-dlp -f`. If that fails, a best-audio fallback is attempted: `bestaudio[ext=m4a]/bestaudio/best`.

## Spotify Resolution

Two layers:

1. Track ID extraction (URL path segments or `spotify:track:<id>` URI form). If credentials set, fetch metadata and form a `ytsearch1:"Artist - Title"` query.
2. If metadata fetch fails and `allow_spotify_title_search` enabled: use `yt-dlp -e` (title) then search.

## Caching Strategy

Currently: per-resolution temporary file (OS temp dir) without reuse. Future work aims to implement a LRU cache.

## Source Allow/Block

Before resolving or accepting direct URIs, `is_uri_allowed()` enforces configured regex lists. Block patterns always override allow matches.

## Operational Considerations

- Resolver increases first-play latency (download+transcode)
- Hosting requires adequate disk IO for temporary files
- Observe logs for warnings (e.g., missing Spotify credentials on Spotify link)

## Failure Modes

| Condition                                   | Outcome                              |
| ------------------------------------------- | ------------------------------------ |
| Unsupported site                            | 400/Failure to create player         |
| Resolver timeout                            | Abort with error (download canceled) |
| Missing Spotify credentials                 | 400 for Spotify URL when required    |
| yt-dlp/ffmpeg absent & cannot auto-download | Startup dependency check failure     |

Next: view the [REST & WebSocket API](../api/reference.md).
