---
outline: deep
---

# Authentication

Resonix currently supports a simple shared password model.

## Configuration

Set in `resonix.toml`:

```toml
[server]
password = "my-long-secret"
```

Or leave unset for open access (not recommended publicly).

## Client Usage

Add header to every HTTP request and WebSocket upgrade:

```
Authorization: my-long-secret
```

No bearer scheme or prefix. Missing or incorrect -> `401 Unauthorized`.

## Example (cURL)

```bash
curl -H "Authorization: my-long-secret" \
  -H "Content-Type: application/json" \
  -d '{"id":"demo","uri":"https://example.com/file.mp3"}' \
  -X POST http://localhost:2333/v0/players
```

## Future Roadmap

| Enhancement   | Description                                        |
| ------------- | -------------------------------------------------- |
| Token API     | Generate & revoke scoped tokens (playback, admin). |
| Rate limiting | Per token/IP quotas.                               |
| mTLS          | Optional client certificate verification.          |

For now rely on reverse proxy (IP allowlists, TLS) for additional protections.
