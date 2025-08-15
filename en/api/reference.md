---
outline: deep
---

# API Overview

Base URL defaults to: `http://<host>:<port>` (usually `http://localhost:2333`).

All endpoints reside under `/v0`. Authentication: include `Authorization: <password>` header if configured.

## Resources

| Resource               | Methods                                               |
| ---------------------- | ----------------------------------------------------- |
| Players                | Create, list, control playback, delete                |
| Queue                  | Enqueue, fetch, loop modes, skip                      |
| Filters                | Update volume & EQ                                    |
| Metadata               | Merge or replace JSON payload                         |
| Resolver               | Convert page URL to direct (if enabled)               |
| Track Encoding Helpers | Encode/decode base64 track identifiers (compat layer) |
| WebSocket Streams      | Audio frames & events                                 |

## Conventions

- JSON bodies for POST/PATCH
- 204 No Content for successful state changes without a body
- 201 Created for resource creation (player, track enqueue)
- 4xx codes for client errors (403 blocked source, 404 unknown player, 409 duplicate id)
- 5xx for unexpected internal errors

## Player Lifecycle

1. `POST /v0/players` with `{ id, uri, metadata? }`
2. Connect `GET /v0/players/{id}/ws` for audio
3. (Optional) Connect `GET /v0/players/{id}/events` for JSON event stream
4. Queue more tracks: `POST /v0/players/{id}/queue`
5. Control playback (play/pause/skip/loop/filters)
6. Delete player: `DELETE /v0/players/{id}`

## Status Snapshot

`GET /v0/players` returns array of player objects each embedding current track info + metadata.

Proceed to detailed [REST Endpoints](./endpoints.md) or [WebSocket Streaming](./websocket.md).
