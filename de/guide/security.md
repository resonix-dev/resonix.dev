---
outline: deep
---

# Sicherheit

Resonix implementiert aktuell ein minimales Auth‑Modell mit Ausbauplänen.

## Aktuelles Modell

- Optionales gemeinsames Passwort `[server].password`
- Jeder HTTP Request: `Authorization: <password>`
- WebSocket Upgrades nutzen gleiche Middleware

Schutz basiert auf Transportsicherheit: Hinter TLS bereitstellen um Passwortabgriff zu verhindern.

## Bedrohungen

| Bedrohung                                      | Maßnahme / Status                                        |
| ---------------------------------------------- | -------------------------------------------------------- |
| Unautorisierter Zugriff / Ressourcenmissbrauch | Passwort nötig (falls gesetzt).                          |
| Brute Force                                    | Externes Rate Limiting (Proxy / WAF).                    |
| Quellenmissbrauch                              | Regex Allow/Block Muster.                                |
| Kompromittierte Dependencies                   | Download von offiziellen Quellen; zukünftig Checksums.   |
| Log Leaks                                      | Logs ohne sensitive Daten; keine Secrets in URIs.        |
| Path Traversal                                 | Nutzer kontrolliert Pfade; via Allow Regex einschränken. |

## Empfehlungen

- Starkes Passwort in Produktion
- Netzwerkzugriff einschränken (Firewall)
- HTTPS nutzen; kein Plain HTTP über unsichere Netze
- `yt-dlp` & `ffmpeg` aktuell halten (Cache leeren)
- In eingeschränktem Container/User betreiben

## Zukünftige Verbesserungen

| Feature                               | Priorität |
| ------------------------------------- | --------- |
| Tokenbasierte Auth mit Scopes         | Hoch      |
| Rate Limiting Middleware              | Mittel    |
| mTLS / API Key Rotation               | Mittel    |
| Signaturprüfung geladener Binaries    | Mittel    |
| Audit Log administrativer Operationen | Niedrig   |
