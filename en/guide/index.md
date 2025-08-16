---
outline: deep
---

# Guides Overview

The documentation is now split into two tracks:

## 1. Audio Node (Server)

Run & operate the standalone Resonix audio node written in Rust. Covers installation, configuration, deployment, resolver & platform specifics.

Key topics:

- [Introduction](./introduction.md)
- [Installation](./installation.md)
- [Configuration](./configuration.md)
- [Resolver](./resolver.md)
- [Architecture](./architecture.md)
- [Deployment](./deployment.md)
- [Security](./security.md)
- [Troubleshooting](./troubleshooting.md)

## 2. Client Library (`resonix.js`)

Integrate a Discord bot or other Node.js application with a Resonix audio node using the lightweight JavaScript/TypeScript client.

Start here if you already have (or can access) a running audio node and want to control playback / stream audio into Discord voice channels.

Client topics:

- [Overview](./client/overview.md)
- [Client Installation](./client/installation.md)
- [Usage & Examples](./client/usage.md)
- [Client API Surface](./client/api.md)
- [Client Troubleshooting](./client/troubleshooting.md)
- [Client Roadmap](./client/roadmap.md)

> The server and client evolve together; ensure compatible versions (client README lists tested server version range). Generally a client with the same major.minor as the node is expected to work.

Next: pick a track above depending on whether you are deploying the server or integrating a bot/app.
