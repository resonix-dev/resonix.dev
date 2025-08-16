---
outline: deep
---

# Client Troubleshooting

## Silence / No Audio

- Confirm server logs frames / TrackStart.
- Ensure your bot joined a voice channel and `connection.subscribe()` succeeded (handled by manager).
- Check frame size logs (3840 bytes). If different, verify no proxy altering binary frames.
- Volume may be set very low server-side (`setVolume(0)`).

## WebSocket Closes Immediately

- Server password required but not yet supported in helper; ensure server either has no password or wrap REST calls manually (feature pending).
- Base URL wrong or missing `/v0` version when specifying `version` option.

## High Latency or Stutter

- Your process is blocking the event loop (long sync operations). Offload heavy work.
- Host/server network latency high; deploy closer to Discord voice region.

## Frame Energy 0 Warnings

Initial frames may be silent; persistent zero energy indicates silent source or mismatch.

## TypeScript Types Not Found

Ensure you installed `resonix.js` (not `@resonix/node`). Clear build cache or restart TS server.
