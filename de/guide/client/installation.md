---
outline: deep
---

# Client Installation

Installiere das npm Paket in deinem Bot / App Projekt:

::: code-group

```sh [npm]
$ npm install resonix.js
```

```sh [pnpm]
$ pnpm install resonix.js
```

```sh [yarn]
$ yarn add resonix.js
```

```sh [bun]
$ bun add resonix.js
```

:::

Peer Abhängigkeiten:

- `discord.js` (für Voice State + Intents) & `@discordjs/voice`
- Node.js 18+ (WebSocket + fetch vorhanden; sonst Polyfill)

Prüfe, dass dein Resonix Audio Node läuft und erreichbar ist (Standard `http://localhost:2333`).

Umgebungsaspekte:

- Falls der Server ein Passwort nutzt, als Umgebung setzen und in REST Calls (später Helper) mitsenden.
- Firewalls / Container Regeln müssen ausgehende WebSockets erlauben.
