---
outline: deep
---

# Installation

Resonix kann betrieben werden über:

1. Vorgebaute Binaries (empfohlen für Produktion)
2. `npm` (globales Paket, das die Server‑Binary bündelt oder findet)
3. Build aus Source (Cargo)

## 1. Vorgebaute Binaries

Neueste Release (Beispiel v0.3.0): https://github.com/resonix-dev/resonix-node/releases

### Unterstützte Artefakte (v0.3.0)

| OS      | Arch    | Datei                                      |
| ------- | ------- | ------------------------------------------ |
| Linux   | x86_64  | `resonix-node-v0.3.0-linux-x86_64.tar.gz`  |
| Linux   | aarch64 | `resonix-node-v0.3.0-linux-aarch64.tar.gz` |
| Linux   | armv7   | `resonix-node-v0.3.0-linux-armv7.tar.gz`   |
| macOS   | aarch64 | `resonix-node-v0.3.0-macos-aarch64.tar.gz` |
| macOS   | x86_64  | `resonix-node-v0.3.0-macos-x86_64.tar.gz`  |
| Windows | x86_64  | `resonix-node-v0.3.0-windows-x86_64.zip`   |
| Windows | aarch64 | `resonix-node-v0.3.0-windows-aarch64.zip`  |

Jedes Archiv hat eine `.sha256` Prüfsumme.

Namensschema: `resonix-node-v<version>-<os>-<arch>.<ext>`

Executable entpacken und in PATH legen oder direkt ausführen.

```powershell
# Windows Beispiel
Invoke-WebRequest -OutFile resonix-node-v0.3.0-windows-x86_64.zip https://github.com/resonix-dev/resonix-node/releases/download/v0.3.0/resonix-node-v0.3.0-windows-x86_64.zip
Expand-Archive resonix-node-v0.3.0-windows-x86_64.zip -DestinationPath .
./resonix-node.exe
```

Erster Start erstellt `resonix.toml` falls fehlend.

### Prüfsumme verifizieren

PowerShell:

```powershell
Get-FileHash resonix-node-v0.3.0-windows-x86_64.zip -Algorithm SHA256 | Select-Object -ExpandProperty Hash
```

Linux / macOS:

```bash
sha256sum resonix-node-v0.3.0-linux-x86_64.tar.gz
```

Oder `.sha256` Datei nutzen:

```bash
sha256sum -c resonix-node-v0.3.0-linux-x86_64.tar.gz.sha256
```

## 2. Node.js Global Package

Global installieren:

::: code-group

```sh [npm]
$ npm install -g @resonix/node
```

```sh [pnpm]
$ pnpm install -g @resonix/node
```

```sh [yarn]
$ yarn global add @resonix/node
```

```sh [bun]
$ bun add -g @resonix/node
```

:::

Dann ausführen:

```bash
resonix-node
```

Das Paket bringt eine Binary mit oder lädt sie beim ersten Start herunter.

## 3. Build aus Source (Rust)

Voraussetzungen:

- Rust Toolchain (stable) https://rustup.rs
- (Optional) C Toolchain für bestimmte Dependencies

Klonen & bauen:

```bash
git clone https://github.com/resonix-dev/resonix-node.git
cd resonix-node
cargo build --release
./target/release/resonix-node
```

## Laufzeitabhängigkeiten

Ohne externe Tools lauffähig bei Nutzung direkter HTTP/File URLs. Der Resolver (YouTube/Spotify/SoundCloud) benötigt:

- `yt-dlp`
- `ffmpeg`

Beim Start prüft Resonix deren Vorhandensein. Falls fehlend und Resolver aktiv -> Download nach `~/.resonix/bin` (Windows: `%USERPROFILE%\.resonix\bin`).

## Installation prüfen

1. Server starten: `resonix-node`
2. Log: `Listening addr=0.0.0.0:2333`
3. Version abfragen:

```bash
curl http://localhost:2333/version
```

4. Info:

```bash
curl http://localhost:2333/info
```

5. Player erstellen:

```bash
curl -X POST http://localhost:2333/v0/players \
  -H 'Content-Type: application/json' \
  -d '{"id":"test","uri":"https://example.com/audio.mp3"}'
```

Mit Auth: `-H "Authorization: <password>"`.
