---
outline: deep
---

# REST Endpoints

All endpoints expect/produce JSON unless noted. `Authorization` header required if password configured.

## Players

### Create Player

`POST /v0/players`

Body:

```json
{
  "id": "string", // unique player id you choose
  "uri": "string", // direct or resolvable URI
  "metadata": { "any": "json" } // optional arbitrary JSON
}
```

Responses:

- 201 Created `{ "id": "<id>" }`
- 409 Conflict (duplicate id)
- 403 Forbidden (blocked URI)
- 400 Bad Request (invalid data)

### List Players

`GET /v0/players`

Returns array of players each containing:

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

### Delete Player

`DELETE /v0/players/{id}` -> 204 or 404.

### Play / Pause

`POST /v0/players/{id}/play` -> 204
`POST /v0/players/{id}/pause` -> 204

### Skip

`POST /v0/players/{id}/skip` -> 204 (Triggers TrackEnd + next selection logic).

## Queue

### Enqueue

`POST /v0/players/{id}/queue`

```json
{ "uri": "string", "metadata": { "any": "json" } }
```

-> 201 `{ "trackId": "uuid" }`

### Get Queue

`GET /v0/players/{id}/queue`
Returns array of queued track items:

```json
[{ "id": "uuid", "uri": "string", "metadata": { ... } }]
```

## Loop Mode

### Set

`PATCH /v0/players/{id}/loop`

```json
{ "mode": "none" | "track" | "queue" }
```

-> 204

## Filters

### Update Volume & EQ

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

## Metadata

### Merge or Replace

`PATCH /v0/players/{id}/metadata`

```json
{ "merge": true, "value": { "album": "Example" } }
```

-> 204

## Resolver

### Resolve URL (Manual)

`GET /v0/resolve?url=<encoded>` -> 200 body = direct path/URL or 400.

Requires resolver enabled and allowed source.

## Track Helpers

### Load Tracks

`GET /v0/loadtracks?identifier=<id>`

Returns either:

```json
{
  "loadType": "track",
  "data": {
    /* TrackOut */
  }
}
```

Or:

```json
{ "loadType": "empty", "data": {} }
```

### Decode Track

`GET /v0/decodetrack?encodedTrack=<b64>` -> `TrackOut` or 400.

### Decode Multiple

`POST /v0/decodetracks`
Body: `["base64", "base64"]` -> list of `TrackOut` objects.

## Info

### Info

`GET /info`

```json
{ "version": "x.y.z", "buildTime": 1712345678900 }
```

### Version

`GET /version` -> plain text or JSON version (implementation detail).

## Errors

| Code | Meaning                                        |
| ---- | ---------------------------------------------- |
| 400  | Bad input / invalid base64 / resolver disabled |
| 401  | Missing or wrong password                      |
| 403  | URI blocked by source patterns                 |
| 404  | Player not found                               |
| 409  | Player id already exists                       |
| 500  | Internal error                                 |
