---
outline: deep
---

# API Überblick

Standard‑Basis‑URL: `http://<host>:<port>` (typisch `http://localhost:2333`).

Alle Endpoints liegen unter `/v0`. Authentifizierung: `Authorization: <passwort>` Header senden, falls konfiguriert.

## Ressourcen

| Ressource              | Funktionen                                                     |
| ---------------------- | -------------------------------------------------------------- |
| Players                | Erstellen, listen, Playback steuern, löschen                   |
| Queue                  | Einreihen, abrufen, Loop‑Modi, Skip                            |
| Filter                 | Lautstärke & EQ aktualisieren                                  |
| Metadata               | JSON zusammenführen oder ersetzen                              |
| Resolver               | Seiten‑URL in direkte URL konvertieren (wenn aktiv)            |
| Track Encoding Helpers | base64 Track‑Identifier encodieren/decodieren (Kompatibilität) |
| WebSocket Streams      | Audioframes & Events                                           |

## Konventionen

- JSON Bodies für POST/PATCH
- 204 No Content bei erfolgreichen Statusänderungen ohne Body
- 201 Created bei Ressourcenerstellung (Player, Track in Queue)
- 4xx Codes für Clientfehler (403 blockierte Quelle, 404 unbekannter Player, 409 doppelte ID)
- 5xx für unerwartete interne Fehler

## Player Lebenszyklus

1. `POST /v0/players` mit `{ id, uri, metadata? }`
2. Verbinden `GET /v0/players/{id}/ws` für Audio
3. (Optional) Verbinden `GET /v0/players/{id}/events` für JSON Eventstream
4. Weitere Tracks einreihen: `POST /v0/players/{id}/queue`
5. Playback steuern (play/pause/skip/loop/filter)
6. Player löschen: `DELETE /v0/players/{id}`

## Status Snapshot

`GET /v0/players` liefert ein Array von Playerobjekten inkl. aktuellem Track & Metadaten.
