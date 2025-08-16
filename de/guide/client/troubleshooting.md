---
outline: deep
---

# Client Fehlerbehebung

## Stille / Keine Audio

- Prüfen ob der Server Frames / TrackStart loggt.
- Sicherstellen, dass der Bot einem Voice Channel beigetreten ist und `connection.subscribe()` erfolgreich war (Manager übernimmt das i.d.R.).
- Framegröße prüfen (3840 Bytes). Abweichungen deuten auf Proxy / Manipulation hin.
- Lautstärke serverseitig evtl. auf 0 (`setVolume(0)`).

## WebSocket schließt sofort

- Server Passwort nötig aber noch nicht über Helper unterstützt – entweder ohne Passwort testen oder REST Requests selbst authentifizieren.
- Base URL inkorrekt oder fehlendes `/v0` bei gesetzter `version` Option.

## Hohe Latenz / Ruckeln

- Event Loop blockiert (lange synchrone Funktionen) – refaktorieren / auslagern.
- Hohe Netzwerklatenz – Server näher an Discord Region deployen.

## Frame Energie 0 Warnungen

Erste Frames können still sein; dauerhaft 0 => Quelle still oder falsches Format.

## TypeScript Typen fehlen

`resonix` installiert? Nicht mit `@resonix/node` verwechseln. TS Server neu starten.

Weiter zur [Client Roadmap](./roadmap.md).
