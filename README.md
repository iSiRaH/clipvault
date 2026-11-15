# ClipVault

A fast, lightweight, and extensible clipboard manager built with **Rust** and **Tauri v2** (React + TypeScript).

## Project Overview & Structure

ClipVault is organized as a Cargo workspace alongside a pnpm frontend workspace:

```text
clipvault/
├── apps/
│   └── desktop/               # Tauri frontend & application shell
│       ├── src/               # React + TypeScript UI
│       └── src-tauri/         # Tauri backend application (Rust)
├── crates/
│   ├── clipboard-core/        # Domain models, deduplication, and monitoring engine
│   ├── clipboard-storage/     # Storage engine (SQLite / history cache)
│   └── platform-linux/        # Linux-specific clipboard provider (Wayland / X11 via arboard)
├── docs/                      # Architecture and roadmap documentation
├── package.json               # Root workspace scripts (pnpm)
└── Cargo.toml                 # Cargo workspace configuration
```

---

## Prerequisites

Before running or building ClipVault, ensure you have installed:

1. **Rust & Cargo** (v1.85+ recommended, 2024 edition support):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
2. **Node.js** (v18+ or v20+) and **pnpm**:
   ```bash
   corepack enable
   # or: npm install -g pnpm
   ```
3. **Linux System Dependencies** (for Tauri v2 and clipboard access):
   - **Debian / Ubuntu**:
     ```bash
     sudo apt update
     sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
       libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
     ```
   - **Fedora / RHEL**:
     ```bash
     sudo dnf install -y webkit2gtk4.1-devel openssl-devel curl wget \
       libappindicator-gtk3-devel librsvg2-devel
     ```
   - **Arch Linux**:
     ```bash
     sudo pacman -S --needed webkit2gtk-4.1 base-devel curl wget \
       openssl libappindicator-gtk3 librsvg
     ```

---

## Getting Started & Running

### 1. Install Frontend Dependencies

From the repository root:

```bash
pnpm install
```

---

### 2. Running in Development Mode (Recommended)

Run the full Tauri app with hot reloading for both the frontend (Vite) and the backend (Cargo):

```bash
pnpm tauri:dev
```

*Alternatively, run directly with cargo:*
```bash
cargo run -p desktop --bin desktop
```
*(Note: when running `cargo run` directly without a Vite dev server running, make sure you ran `pnpm build` first so `apps/desktop/dist` exists).*

---

### 3. Running Backend Tests & Checks

Run Rust workspace tests and verification across all crates:

```bash
# Check all workspace crates
cargo check --workspace

# Run all test suites
cargo test --workspace
```

---

### 4. Building for Production

To create an optimized production build of the desktop application:

```bash
pnpm tauri:build
```

The compiled binaries and packages (e.g. AppImage, deb, rpm depending on OS) will be located in `apps/desktop/src-tauri/target/release/bundle/`.

---

## Available Root Scripts

| Script | Command | Description |
| --- | --- | --- |
| `pnpm dev` | `pnpm --filter desktop dev` | Starts the Vite frontend dev server |
| `pnpm build` | `pnpm --filter desktop build` | Builds the React frontend dist assets |
| `pnpm tauri` | `pnpm --filter desktop tauri` | Runs Tauri CLI commands |
| `pnpm tauri:dev` | `pnpm --filter desktop tauri dev` | Runs the full desktop app in dev mode |
| `pnpm tauri:build` | `pnpm --filter desktop tauri build` | Bundles the desktop app for release |

