import { argos } from './logger';

type ConsoleMethods = Pick<Console, 'log' | 'info' | 'warn' | 'error' | 'debug'>;

let originalConsole: ConsoleMethods | null = null;

/**
 * Monkey-patches global console methods to forward calls to os_log
 * while still calling the original (so Metro/DevTools remain unaffected).
 *
 * Call once, early in your entry point (index.js / index.ts).
 *
 * @returns argos.unwatch — a function to restore the original console.
 *
 * @example
 * // index.ts
 * import { argos } from 'react-native-argos';
 * argos.watch();
 */
export function watch(): () => void {
  if (originalConsole) {
    // Already watching — don't double-wrap
    return unwatch;
  }

  originalConsole = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug.bind(console),
  };

  console.log = (...args: unknown[]) => {
    originalConsole!.log(...(args as Parameters<typeof console.log>));
    argos.debug(...args);
  };

  console.info = (...args: unknown[]) => {
    originalConsole!.info(...(args as Parameters<typeof console.info>));
    argos.info(...args);
  };

  console.warn = (...args: unknown[]) => {
    originalConsole!.warn(...(args as Parameters<typeof console.warn>));
    argos.warning(...args);
  };

  console.error = (...args: unknown[]) => {
    originalConsole!.error(...(args as Parameters<typeof console.error>));
    argos.error(...args);
  };

  console.debug = (...args: unknown[]) => {
    originalConsole!.debug(...(args as Parameters<typeof console.debug>));
    argos.debug(...args);
  };

  return unwatch;
}

/**
 * Restore original console methods.
 */
export function unwatch(): void {
  if (!originalConsole) return;
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.debug = originalConsole.debug;
  originalConsole = null;
}
