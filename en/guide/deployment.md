---
outline: deep
---

# Deployment

Best practices for running Resonix in production.

## Binary Placement

Prefer static release binaries. Keep them outside mutable working directories; run with a dedicated service user if possible.

## Systemd (Linux)

Example unit:

```ini
[Unit]
Description=Resonix Audio Node
After=network.target

[Service]
Type=simple
User=resonix
Group=resonix
WorkingDirectory=/opt/resonix
ExecStart=/opt/resonix/resonix-node
Restart=on-failure
RestartSec=3
Environment=RUST_LOG=info
# Environment=RESONIX_RESOLVE=1

[Install]
WantedBy=multi-user.target
```

Reload & enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now resonix
```

## Windows Service

Use NSSM or sc.exe:

```powershell
nssm install Resonix "C:\Tools\resonix-node.exe"
```

## Containerization

A minimal example `Dockerfile` (multi‑stage) could be added (future). Consider mounting a volume at `/data` if implementing persistent cache later.

## Logs

- Rotated manually (currently single `latest.log`) – integrate with external log rotation or shipping (vector, fluent-bit)
- Use `RUST_LOG=debug` sparingly (verbose)

## Resource Sizing

| Resource  | Guidance                                                                                                                |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| CPU       | One core per ~10 active players (rough heuristic).                                                                      |
| RAM       | Low; buffers & decoder state per player (~few MB).                                                                      |
| Disk      | Temporary downloads; plan for peak concurrent downloads \* average track size (eg 25–50MB each).                        |
| Bandwidth | PCM streaming uncompressed: 3840 bytes / 20ms ≈ 192KB/s ≈ 1.5Mbps per client. Future Opus will reduce this drastically. |

## Reverse Proxy

If exposing publicly, terminate TLS at Nginx / Caddy / Traefik and forward to internal port (2333). Ensure WebSocket upgrade headers preserved.

Nginx snippet:

```nginx
location / {
  proxy_pass http://127.0.0.1:2333;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection $connection_upgrade;
  proxy_set_header Host $host;
}
```

## Health Checks

No dedicated endpoint yet; use `/version` or `/info` for liveness.

## Upgrades

1. Graceful stop (Ctrl+C or service stop)
2. Replace binary
3. Start service – players recreated by clients

## Backups

Currently stateless (no persistent metadata or queue). Only config (`resonix.toml`) and log retention policies matter.

Next: review [Security practices](./security.md).
