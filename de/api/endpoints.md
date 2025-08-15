---
outline: deep
---

# REST Endpoints

Alle Endpoints erwarten/liefern JSON sofern nicht anders erwähnt. `Authorization`‑Header erforderlich, falls Passwort gesetzt ist.

## Player

### Player anlegen

`POST /v0/players`

Body:

```json
{
  "id": "string", // eindeutige Player-ID (frei wählbar)
  "uri": "string", // direkte oder auflösbare URI
  "metadata": { "any": "json" } // optionale beliebige JSON-Metadaten
}
```

Antworten:

- 201 Created `{ "id": "<id>" }`
- 409 Conflict (ID existiert bereits)
- 403 Forbidden (URI blockiert)
- 400 Bad Request (ungültige Daten)

### Player auflisten

`GET /v0/players`

Gibt ein Array zurück; jeder Eintrag enthält:

```jsonc
{
  "id": "player1",
  "track": {
    "encoded": "base64identifier",
    "info": {
      "identifier": "original-or-direct-uri",
      "isSeekable": false,
      "author": "",
      "length": 0,
      "isStream": true,
      "position": 2000,
      "title": "derived title",
      "uri": "direct-uri-or-source",
      "artworkUrl": null,
      "isrc": null,
      "sourceName": "http|file|direct",
    },
    "pluginInfo": {},
    "userData": {
      /* metadata JSON */
    },
  },
}
```

### Player löschen

`DELETE /v0/players/{id}` -> 204 oder 404.

### Play / Pause

`POST /v0/players/{id}/play` -> 204
`POST /v0/players/{id}/pause` -> 204

### Skip

`POST /v0/players/{id}/skip` -> 204 (löst TrackEnd + nächste Auswahl aus).

## Queue

### Einreihen

`POST /v0/players/{id}/queue`

```json
{ "uri": "string", "metadata": { "any": "json" } }
```

-> 201 `{ "trackId": "uuid" }`

### Queue abrufen

`GET /v0/players/{id}/queue`
Gibt ein Array der wartenden Tracks:

```json
[{ "id": "uuid", "uri": "string", "metadata": { ... } }]
```

## Loop Mode

### Setzen

`PATCH /v0/players/{id}/loop`

```json
{ "mode": "none" | "track" | "queue" }
```

-> 204

## Filter

### Lautstärke & EQ aktualisieren

`PATCH /v0/players/{id}/filters`

```json
{
  "volume": 1.0, // 0.0 - 5.0
  "eq": [
    { "band": 0, "gain_db": -3.0 },
    { "band": 5, "gain_db": 4.5 }
  ]
}
```

-> 204

## Metadaten

### Zusammenführen oder ersetzen

`PATCH /v0/players/{id}/metadata`

```json
{ "merge": true, "value": { "album": "Beispiel" } }
```

-> 204

## Resolver

### URL manuell auflösen

`GET /v0/resolve?url=<encoded>` -> 200 Body = direkter Pfad/URL oder 400.

Erfordert aktivierten Resolver und erlaubte Quelle.

## Track‑Hilfen

### Tracks laden

`GET /v0/loadtracks?identifier=<id>`

Liefert entweder:

```json
{
  "loadType": "track",
  "data": {
    /* TrackOut */
  }
}
```

Oder:

```json
{ "loadType": "empty", "data": {} }
```

### Track decodieren

`GET /v0/decodetrack?encodedTrack=<b64>` -> `TrackOut` oder 400.

### Mehrere decodieren

`POST /v0/decodetracks`
Body: `["base64", "base64"]` -> Liste von `TrackOut` Objekten.

## Info

### Info

`GET /info`

```json
{ "version": "x.y.z", "buildTime": 1712345678900 }
```

### Version

`GET /version` -> Klartext oder JSON Version (Implementierungsdetail).

## Fehler

| Code | Bedeutung                                                   |
| ---- | ----------------------------------------------------------- |
| 400  | Ungültige Eingabe / invalides base64 / Resolver deaktiviert |
| 401  | Fehlendes oder falsches Passwort                            |
| 403  | URI durch Muster blockiert                                  |
| 404  | Player nicht gefunden                                       |
| 409  | Player-ID existiert bereits                                 |
| 500  | Interner Fehler                                             |
