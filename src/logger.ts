import NativeArgos from './NativeArgos';

export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'fault';

export interface ArgosConfig {
  /** Reverse-DNS app identifier. Defaults to bundle ID (set by native side). */
  subsystem?: string;
  /** Category label shown in Console.app filters. Defaults to "ReactNative". */
  category?: string;
}

// Sentinels that tell the native side to use its own defaults
const DEFAULT_SUBSYSTEM = '__bundle_id__';
const DEFAULT_CATEGORY = 'ReactNative';

let globalSubsystem = DEFAULT_SUBSYSTEM;
let globalCategory = DEFAULT_CATEGORY;

/**
 * Serialize console arguments to a single string.
 * Handles multiple args, objects (JSON), and Errors (with stack).
 */
function serialize(args: unknown[]): string {
  return args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) {
        return arg.stack ? `${arg.message}\n${arg.stack}` : arg.message;
      }
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return String(arg);
      }
    })
    .join(' ');
}

function send(level: LogLevel, args: unknown[]): void {
  try {
    NativeArgos.log(level, globalSubsystem, globalCategory, serialize(args));
  } catch {
    // Silently no-op if native module not available (e.g. Android, JS-only envs)
  }
}

export const argos = {
  /** Configure default subsystem and category for all log calls. */
  configure(config: ArgosConfig): void {
    if (config.subsystem) globalSubsystem = config.subsystem;
    if (config.category) globalCategory = config.category;
  },

  /** Create a child logger with a different category (inherits subsystem). */
  withCategory(category: string) {
    return {
      debug: (...args: unknown[]) =>
        NativeArgos.log('debug', globalSubsystem, category, serialize(args)),
      info: (...args: unknown[]) =>
        NativeArgos.log('info', globalSubsystem, category, serialize(args)),
      warning: (...args: unknown[]) =>
        NativeArgos.log('warning', globalSubsystem, category, serialize(args)),
      error: (...args: unknown[]) =>
        NativeArgos.log('error', globalSubsystem, category, serialize(args)),
      fault: (...args: unknown[]) =>
        NativeArgos.log('fault', globalSubsystem, category, serialize(args)),
    };
  },

  debug: (...args: unknown[]) => send('debug', args),
  info: (...args: unknown[]) => send('info', args),
  warning: (...args: unknown[]) => send('warning', args),
  error: (...args: unknown[]) => send('error', args),
  fault: (...args: unknown[]) => send('fault', args),
};
