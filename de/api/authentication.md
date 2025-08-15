---
outline: deep
---

# Authentifizierung

Resonix unterstützt derzeit ein simples Modell mit gemeinsam genutztem Passwort.

## Konfiguration

Eintrag in `resonix.toml`:

```toml
[server]
password = "mein-langes-geheimnis"
```

Oder leer lassen für offenen Zugriff (öffentlich nicht empfohlen).

## Nutzung im Client

Header zu jeder HTTP‑Anfrage und jedem WebSocket‑Upgrade hinzufügen:

```
Authorization: mein-langes-geheimnis
```

Kein Bearer‑Schema oder Präfix. Fehlend oder falsch -> `401 Unauthorized`.

## Beispiel (cURL)

```bash
curl -H "Authorization: mein-langes-geheimnis" \
  -H "Content-Type: application/json" \
  -d '{"id":"demo","uri":"https://example.com/file.mp3"}' \
  -X POST http://localhost:2333/v0/players
```

## Zukünftige Roadmap

| Erweiterung   | Beschreibung                                                   |
| ------------- | -------------------------------------------------------------- |
| Token API     | Erzeugen & Widerrufen von Tokens mit Scopes (Playback, Admin). |
| Rate Limiting | Quoten pro Token/IP.                                           |
| mTLS          | Optionale Client‑Zertifikat‑Prüfung.                           |

Bis dahin: Reverse Proxy (IP Allowlist, TLS) für zusätzlichen Schutz nutzen.
