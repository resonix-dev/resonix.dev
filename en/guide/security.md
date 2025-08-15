---
outline: deep
---

# Security

Resonix currently implements a minimal authentication mechanism with plans for expansion.

## Current Model

- Optional shared secret password in config: `[server].password`
- Every HTTP request must include a literal header `Authorization: <password>`
- WebSocket upgrades inherit the same middleware enforcement

Strength comes from transport security: deploy behind TLS (reverse proxy or terminate locally in future) to prevent password leakage.

## Threat Considerations

| Threat                                            | Mitigation / Status                                                                             |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Unauthorized playback / resource abuse            | Shared password required (if configured).                                                       |
| Brute force password attempts                     | Basic; rely on external rate limiting (reverse proxy / WAF).                                    |
| Source abuse (e.g., streaming disallowed domains) | Regex allow/block patterns.                                                                     |
| Dependency compromise (yt-dlp/ffmpeg)             | Download from official release URLs at runtime; verify network path (future: checksum pinning). |
| Log leakage                                       | Logs omit sensitive data; avoid embedding secrets in URIs.                                      |
| Path traversal in local file URIs                 | Users control provided file paths – recommended to restrict using allow regex.                  |

## Recommendations

- Always set a strong password in production
- Restrict network access (firewall / security group)
- Use HTTPS; never expose plain HTTP across untrusted networks
- Maintain `yt-dlp` & `ffmpeg` up to date by removing cached binaries when needed
- Consider running in a restricted container / user

## Future Enhancements

| Feature                                               | Priority |
| ----------------------------------------------------- | -------- |
| Token-based auth with scopes (playback, queue, admin) | High     |
| Rate limiting middleware                              | Medium   |
| mTLS / API key rotation                               | Medium   |
| Downloaded binary signature verification              | Medium   |
| Audit log of administrative operations                | Low      |

Next: see [Troubleshooting](./troubleshooting.md).
