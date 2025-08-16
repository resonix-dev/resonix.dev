---
outline: deep
---

# Installation

Resonix can be run via:

1. Prebuilt standalone binaries (recommended for production)
2. `npm` (global install of the Node wrapper which bundles/locates the server binary)
3. Building from source (Cargo)

## 1. Prebuilt Binaries

Download the latest release (v0.2.6 shown below) from: https://github.com/resonix-dev/resonix-node/releases

### Supported Release Artifacts (v0.2.6)

| OS      | Arch    | File                                       |
| ------- | ------- | ------------------------------------------ |
| Linux   | x86_64  | `resonix-node-v0.2.6-linux-x86_64.tar.gz`  |
| Linux   | aarch64 | `resonix-node-v0.2.6-linux-aarch64.tar.gz` |
| Linux   | armv7   | `resonix-node-v0.2.6-linux-armv7.tar.gz`   |
| macOS   | aarch64 | `resonix-node-v0.2.6-macos-aarch64.tar.gz` |
| macOS   | x86_64  | `resonix-node-v0.2.6-macos-x86_64.tar.gz`  |
| Windows | x86_64  | `resonix-node-v0.2.6-windows-x86_64.zip`   |
| Windows | aarch64 | `resonix-node-v0.2.6-windows-aarch64.zip`  |

Each archive is accompanied by a `.sha256` file for integrity verification (see below) to avoid cluttering the table.

> Future releases will follow the same naming pattern: `resonix-node-v<version>-<os>-<arch>.<ext>`

Place the extracted executable somewhere in PATH or run it in place.

```powershell
# Windows example
Invoke-WebRequest -OutFile resonix-node-v0.2.6-windows-x86_64.zip https://github.com/resonix-dev/resonix-node/releases/download/v0.2.6/resonix-node-v0.2.6-windows-x86_64.zip
Expand-Archive resonix-node-v0.2.6-windows-x86_64.zip -DestinationPath .
./resonix-node.exe
```

First launch creates a default `resonix.toml` if none exists.

### Checksum Verification

PowerShell (Windows):

```powershell
Get-FileHash resonix-node-v0.2.6-windows-x86_64.zip -Algorithm SHA256 | Select-Object -ExpandProperty Hash
# Compare with: bad291632220c9bd7550992391e4b4faf1d14b77f6a6048d03a6216d3db881b8
```

Linux / macOS:

```bash
sha256sum resonix-node-v0.2.6-linux-x86_64.tar.gz
# Expected: ac1403bb3108aa111e9c40fd92758c263e93218335c2b8a9af685f8f325b7e51
```

Or use the provided `.sha256` file:

```bash
sha256sum -c resonix-node-v0.2.6-linux-x86_64.tar.gz.sha256
```

## 2. Node.js Global Package

Install globally:

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

Then run (command name may reflect package bin, e.g.):

```bash
resonix-node
```

The package either ships a prebuilt binary or assists in downloading one on first run (implementation detail subject to change).

## 3. Build from Source (Rust)

Requirements:

- Rust toolchain (stable) https://rustup.rs
- (Optional) C toolchain if building any dependencies needing it

Clone & build:

```bash
git clone https://github.com/resonix-dev/resonix-node.git
cd resonix-node
cargo build --release
./target/release/resonix-node
```

## Runtime Dependencies

Resonix can run without external tools if you supply only direct HTTP/file URLs in players. The resolver (YouTube/Spotify/SoundCloud) requires:

- `yt-dlp`
- `ffmpeg` (for some formats / transcoding fallback)

On first start, Resonix checks for these. If missing and resolver is enabled it will attempt to download them into `~/.resonix/bin` (Windows: `%USERPROFILE%\\.resonix\\bin`).

## Verifying Installation

1. Start the server: `resonix-node`
2. Observe log line: `Listening addr=0.0.0.0:2333`
3. Query version:

```bash
curl http://localhost:2333/version
```

4. Query info:

```bash
curl http://localhost:2333/info
```

5. Create a player (replace URI with a direct MP3/M4A or resolvable URL if resolver enabled):

```bash
curl -X POST http://localhost:2333/v0/players \
  -H 'Content-Type: application/json' \
  -d '{"id":"test","uri":"https://example.com/audio.mp3"}'
```

If authentication is configured add header: `-H "Authorization: <password>"`.
