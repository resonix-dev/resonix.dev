---
outline: deep
---

# Troubleshooting

Common issues & resolutions.

## Startup Fails: Missing yt-dlp / ffmpeg

```
Required dependency 'yt-dlp' is missing.
```

Cause: Resolver enabled but tools not found and auto-download failed.

Fix:

- Install manually (system package manager) and ensure PATH
- Or disable resolver: set `[resolver].enabled = false` or unset `RESONIX_RESOLVE`

## 401 Unauthorized

Either no `Authorization` header or incorrect value while server password configured.

Verify config value and include header exactly.

## Player Creation 403

URI blocked by source regex patterns.

Adjust `[sources].allowed / blocked` in config.

## Spotify URL Rejected

Warning: Spotify URL but credentials missing.

Set environment or config `[spotify]` section with valid `client_id` and `client_secret`.

## WebSocket Drops / Lagged

Log: `WS lagged; dropped packets`

Consumer not reading fast enough; increase client processing speed or add buffering. (Future: adaptive buffering). Frames are dropped to preserve real-time.

## No Audio / Silence

- Confirm frames arriving (frame size 3840 bytes)
- Check volume filter (ensure not 0)
- Ensure track resolved successfully (log TrackStart)

## High CPU

Multiple concurrent downloads or transcoding via ffmpeg. Pre-cache sources or limit concurrent player creation.

## Frame Size Mismatch

Expect exactly 3840 bytes per message (after initial silent frame). If different, ensure no middleware altering binary frames.

## Logs Not Rotating

Current implementation truncates only on startup (`clean_log_on_start`). Integrate external logrotate if needed.

## Need Debug Info

Set env `RUST_LOG=debug` before starting (more verbose). Revert to `info` afterwards.

Still stuck? File an issue with logs and reproduction steps.
