---
outline: deep
---

# WebSocket Streaming

Zwei WebSocket‑Endpoints pro Player:

1. `GET /v0/players/{id}/ws` – Binärer PCM‑Frame‑Stream
2. `GET /v0/players/{id}/events` – JSON Event‑Nachrichten

`Authorization` Header beifügen falls erforderlich.

## Audiostream (`/ws`)

Nach Verbindungsaufbau:

1. Ein initialer stiller Frame (3840 Null‑Bytes) wird gesendet (Pufferaufwärmung)
2. Fortlaufend folgen Frames zu je 3840 Bytes (20ms PCM)

### Frame Format

| Eigenschaft     | Wert                           |
| --------------- | ------------------------------ |
| Samplerate      | 48.000 Hz                      |
| Kanäle          | 2 (Stereo)                     |
| Sampleformat    | Signiertes 16‑Bit LE           |
| Frame‑Dauer     | 20ms (960 Samples \* 2 Kanäle) |
| Bytes pro Frame | 960 _ 2 _ 2 = 3840             |

Clients rekonstruieren Audio durch Aneinanderfügen der Frames und Abspielen via AudioWorklet / WebAudio (Browser) oder Einspeisen in ein Audio‑Sink (Node, nativ). Keine Timestamps – konstantes 20ms Tempo annehmen.

### Umgang mit Lags

Wenn der Client nicht mithält, können Frames gedroppt werden (Server loggt `WS lagged; dropped packets`). Anwendung sollte kleinere Glitches tolerieren; ggf. Client‑seitiges Puffern (z. B. N Frames sammeln) erwägen.

## Eventstream (`/events`)

Empfängt JSON Nachrichten zum Player‑Lifecycle.

### Event Varianten

Aktuelles `PlayerEvent` Enum (serialisiert):

```jsonc
{ "op": "TrackStart", "id": "player_id", "uri": "direct-or-resolved-uri" }
{ "op": "TrackEnd", "id": "player_id" }
{ "op": "QueueUpdate" }
{ "op": "LoopModeChange", "LoopModeChange": "track" }
```

Kodierung kann sich ändern; unbekannte Felder tolerant behandeln.

## Beispielclient (Node.js)

```js
import WebSocket from "ws";

const audioWs = new WebSocket("ws://localhost:2333/v0/players/test/ws", {
  headers: { Authorization: "mein-passwort" },
});

let frames = 0;
audioWs.on("message", (data) => {
  frames++;
  // Datenpuffer Länge 3840; in Ringpuffer für Wiedergabe schieben
});

const eventsWs = new WebSocket("ws://localhost:2333/v0/players/test/events", {
  headers: { Authorization: "mein-passwort" },
});

eventsWs.on("message", (msg) => {
  const ev = JSON.parse(msg.toString());
  console.log("event", ev);
});
```

## Browser Wiedergabe Skizze

```js
const ctx = new AudioContext({ sampleRate: 48000 });
const ws = new WebSocket("ws://localhost:2333/v0/players/test/ws");
const frameSize = 960;
const channelCount = 2;

ws.binaryType = "arraybuffer";
let bufferQueue = [];

ws.onmessage = (e) => {
  const ab = e.data;
  if (ab.byteLength !== 3840) return;
  bufferQueue.push(new Int16Array(ab));
  if (bufferQueue.length === 25) playBuffered();
};

function playBuffered() {
  while (bufferQueue.length) {
    const frame = bufferQueue.shift();
    const audioBuf = ctx.createBuffer(channelCount, frameSize, 48000);
    const l = audioBuf.getChannelData(0);
    const r = audioBuf.getChannelData(1);
    for (let i = 0, j = 0; i < frame.length; i += 2, j++) {
      l[j] = frame[i] / 32768;
      r[j] = frame[i + 1] / 32768;
    }
    const src = ctx.createBufferSource();
    src.buffer = audioBuf;
    src.connect(ctx.destination);
    src.start();
  }
}
```

## Roadmap

| Geplant               | Grund                             |
| --------------------- | --------------------------------- |
| Opus‑kodierter Stream | Bandbreite & Drops reduzieren.    |
| Heartbeat / Ping      | Hängende Verbindungen erkennen.   |
| Explizite Zeitstempel | Sync & Driftkorrektur verbessern. |
