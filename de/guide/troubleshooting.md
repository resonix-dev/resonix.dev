---
outline: deep
---

# Troubleshooting

Häufige Probleme & Lösungen.

## Start schlägt fehl: yt-dlp / ffmpeg fehlt

```
Required dependency 'yt-dlp' is missing.
```

Ursache: Resolver aktiv, Tools fehlen & Auto‑Download scheiterte.

Lösung:

- Manuell installieren (Paketmanager) & PATH prüfen
- Oder Resolver deaktivieren: `[resolver].enabled = false` bzw. `RESONIX_RESOLVE` entfernen

## 401 Unauthorized

`Authorization` Header fehlt oder Wert falsch bei gesetztem Passwort.

Config prüfen & Header exakt senden.

## Player Erstellung 403

URI durch Source Regex blockiert.

`[sources].allowed / blocked` anpassen.

## Spotify URL abgelehnt

Warnung: Spotify URL aber Credentials fehlen.

Env oder `[spotify]` Sektion mit `client_id` / `client_secret` setzen.

## WebSocket Drops / Lag

Log: `WS lagged; dropped packets`

Client liest zu langsam; Verarbeitung beschleunigen oder Puffern erhöhen. Frames werden gedroppt um Echtzeit zu halten.

## Kein Audio / Stille

- Kommen Frames an (3840 Bytes)?
- Volume Filter prüfen (nicht 0)
- Track Auflösung erfolgreich? (Log TrackStart)

## Hohe CPU

Mehrere parallele Downloads oder ffmpeg Transcoding. Quellen vorab cachen oder parallele Player begrenzen.

## Frame Größe abweichend

Exakt 3840 Bytes erwartet (nach initialem Silent Frame). Middleware prüfen.

## Logs rotieren nicht

Nur Truncation beim Start (`clean_log_on_start`). Externe Rotation konfigurieren.

## Debug Infos nötig

Env `RUST_LOG=debug` setzen. Danach wieder reduzieren.

Immer noch fest? Issue mit Logs & Repro Steps erstellen.
