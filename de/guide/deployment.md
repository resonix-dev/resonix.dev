---
outline: deep
---

# Deployment

Best Practices für Produktion.

## Platzierung der Binary

Statische Release‑Binaries bevorzugen. Außerhalb veränderlicher Arbeitsverzeichnisse ablegen; nach Möglichkeit eigener Service‑User.

## systemd (Linux)

Beispiel Unit:

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

Neu laden & aktivieren:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now resonix
```

## Windows Service

Mit NSSM oder sc.exe:

```powershell
nssm install Resonix "C:\Tools\resonix-node.exe"
```

## Containerisierung

Ein minimales mehrstufiges `Dockerfile` kann zukünftig ergänzt werden. Volume bei `/data` für zukünftigen Cache vorsehen.

## Logs

- Manuelle Rotation (aktuell nur `latest.log`) – externe Logrotation / Shipping integrieren
- `RUST_LOG=debug` sparsam nutzen

## Ressourcenabschätzung

| Ressource  | Richtwert                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------- |
| CPU        | ~1 Core pro 10 aktive Player (grob).                                                            |
| RAM        | Gering; Puffer & Decoderzustand pro Player (einige MB).                                         |
| Disk       | Temporäre Downloads; Spitzen \* durchschnittliche Trackgröße (25–50MB).                         |
| Bandbreite | PCM unkomprimiert: 3840 Bytes / 20ms ≈ 192KB/s ≈ 1.5Mbps je Client. Opus reduziert dies später. |

## Reverse Proxy

Bei öffentlicher Bereitstellung TLS an Nginx / Caddy / Traefik terminieren & an Port 2333 weiterleiten. Upgrade‑Header erhalten.

Nginx Snippet:

```nginx
location / {
  proxy_pass http://127.0.0.1:2333;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection $connection_upgrade;
  proxy_set_header Host $host;
}
```

## Health Checks

Noch kein dedizierter Endpoint; `/version` oder `/info` nutzen.

## Upgrades

1. Sauber stoppen (Ctrl+C / Service Stop)
2. Binary ersetzen
3. Service starten – Clients erzeugen Player neu

## Backups

Aktuell zustandslos (keine persistente Queue/Metadaten). Nur `resonix.toml` & Logrichtlinien relevant.
