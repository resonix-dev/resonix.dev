---
outline: deep
---

# Client Installation

Install the npm package in your bot / app project:

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

Peer requirements:

- `discord.js` (for voice state + intents) & `@discordjs/voice`
- Node.js 18+ (WebSocket + fetch available; polyfill if earlier)

Check your Resonix audio node is running and reachable (default `http://localhost:2333`).

Environment considerations:

- If server has auth password set, export it (and include manually in REST calls once exposed in future helper methods).
- Ensure outbound WebSocket connections allowed (firewall / container network policies).
