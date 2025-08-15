---
outline: deep
---

# WebSocket Streaming

Two WebSocket endpoints per player:

1. `GET /v0/players/{id}/ws` – Binary PCM frame stream
2. `GET /v0/players/{id}/events` – JSON event messages

Include `Authorization` header if required.

## Audio Stream (`/ws`)

After connection:

1. An initial silent frame (3840 zero bytes) is sent (buffer warmup)
2. Continuous frames each 3840 bytes follow (20ms PCM)

### Frame Format

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| Sample rate     | 48,000 Hz                             |
| Channels        | 2 (stereo)                            |
| Sample format   | signed 16-bit LE                      |
| Frame duration  | 20ms (960 samples \* 2 channels)      |
| Bytes per frame | 960 _ 2 (channels) _ 2 (bytes) = 3840 |

Clients reconstruct audio by concatenating frames and playing via an AudioWorklet / WebAudio (browser) or feeding into an audio sink (Node, native). No timestamps included—assume steady 20ms pacing.

### Handling Lag

If client can't keep up, frames may be dropped (server logs `WS lagged; dropped packets`). Application should handle minor glitches; consider client-side buffering (e.g., queue N frames before starting playback).

## Event Stream (`/events`)

Receives JSON messages describing player lifecycle.

### Event Variants

Current `PlayerEvent` enum (serialized):

```jsonc
// Track start
{ "op": "TrackStart", "id": "player_id", "uri": "direct-or-resolved-uri" }
// Track end
{ "op": "TrackEnd", "id": "player_id" }
// Queue changed
{ "op": "QueueUpdate" }
// Loop mode changed
{ "op": "LoopModeChange", "LoopModeChange": "track" } // Tag structure due to serde variant encoding
```

Variant encoding may evolve; treat unknown fields gracefully.

## Sample Client (Node.js)

```js
import WebSocket from "ws";

const audioWs = new WebSocket("ws://localhost:2333/v0/players/test/ws", {
  headers: { Authorization: "my-password" },
});

let frames = 0;
audioWs.on("message", (data) => {
  frames++;
  // data is a Buffer length 3840; push to playback ring buffer
});

const eventsWs = new WebSocket("ws://localhost:2333/v0/players/test/events", {
  headers: { Authorization: "my-password" },
});

eventsWs.on("message", (msg) => {
  const ev = JSON.parse(msg.toString());
  console.log("event", ev);
});
```

## Browser Playback Sketch

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

| Planned                   | Rationale                        |
| ------------------------- | -------------------------------- |
| Opus encoded stream       | Reduce bandwidth & frame drops.  |
| Heartbeat / ping messages | Detect stalled connections.      |
| Explicit timestamps       | Improve sync & drift correction. |

Return to [API Overview](./reference.md) or check [REST Endpoints](./endpoints.md).
