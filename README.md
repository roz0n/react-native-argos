# react-native-argos

> Pipe your React Native logs to Apple's `os_log` — visible in **Console.app** on a real device, no debugger required.

Named after [Argos Panoptes](https://en.wikipedia.org/wiki/Argus_Panoptes), the hundred-eyed giant of Greek mythology.

## Why

When you install a native build on a device (TestFlight, ad-hoc, etc.) and something goes wrong, `console.log` is silent — it never leaves the JS runtime. `os_log` writes to the system log, which you can read live in **Console.app** over USB, even without Xcode attached.

## Requirements

- iOS 14+
- React Native 0.71+ (new architecture)

## Installation

```sh
npm install react-native-argos
cd ios && pod install
```

## Usage

### Option 1 — `argos.watch()`

Call once, early in your entry point. Every `console.log/info/warn/error/debug` call is forwarded to `os_log` while still reaching Metro/DevTools normally.

```ts
// index.ts
import { argos } from 'react-native-argos';

argos.watch();
```

To stop watching and restore the original console:

```ts
argos.unwatch();
```

### Option 2 — Explicit calls

```ts
import { argos } from 'react-native-argos';

argos.debug('Loading user');
argos.info('User loaded', { id: 42 });
argos.warning('Cache miss');
argos.error('Network failed', new Error('timeout'));
argos.fault('Unrecoverable state');
```

### Configuration

By default, the subsystem is your app's bundle ID and the category is `ReactNative`. Override either:

```ts
argos.configure({
  subsystem: 'com.mycompany.myapp', // defaults to Bundle.main.bundleIdentifier
  category: 'Networking',
});
```

### Per-category loggers

Useful for filtering in Console.app by category:

```ts
const authLog = argos.withCategory('Auth');
const netLog  = argos.withCategory('Networking');

authLog.info('Token refreshed');
netLog.error('Request failed', { url, status });
```

## Viewing logs in Console.app

1. Connect your device via USB
2. Open **Console.app** (Cmd+Space → "Console")
3. Select your device in the sidebar
4. Filter by **Subsystem** = your bundle ID, or **Category** = `ReactNative`

That's it. Logs appear in real time, with level colors, on any build — debug, release, TestFlight.

## Log levels

| JS call | os_log level | Console.app color |
|---|---|---|
| `argos.debug` / `console.debug` | `.debug` | grey |
| `argos.info` / `console.log` | `.debug` | grey |
| `argos.info` / `console.info` | `.info` | white |
| `argos.warning` / `console.warn` | `.warning` | yellow |
| `argos.error` / `console.error` | `.error` | red |
| `argos.fault` | `.fault` | red (persisted) |

> **Note:** By default, `os_log` redacts dynamic string content in non-debug builds with `<private>`. Argos marks all messages as `.public` so they're always readable in Console.app.

## License

MIT
