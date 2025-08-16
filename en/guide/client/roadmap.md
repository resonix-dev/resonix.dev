---
outline: deep
---

# Client Roadmap

| Feature                           | Status   | Notes                                          |
| --------------------------------- | -------- | ---------------------------------------------- |
| Player events API                 | Planned  | Bubble server events to client emitters        |
| Reconnect logic (WS + REST)       | Planned  | Backoff & resume on transient network errors   |
| Built-in local queue abstraction  | Consider | Optional wrapper; server already handles queue |
| Search helpers (YouTube/Spotify)  | Consider | Would proxy to server resolver or external API |
| Opus decode support (when server) | Future   | Once server offers Opus WS stream              |
| Metrics / health integration      | Future   | Tie into future server metrics endpoint        |

Suggest additions via issues / PRs.
