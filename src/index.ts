import { argos as _argos } from './logger';
import { watch, unwatch } from './interceptor';

export type { ArgosConfig, LogLevel } from './logger';

/**
 * The Argos logger. One import, full API.
 *
 * @example
 * argos.watch()                    // intercept all console.* calls
 * argos.unwatch()                  // restore original console
 * argos.configure({ category: 'Auth' })
 * argos.debug('message')
 * argos.withCategory('Network').error('timeout')
 */
export const argos = {
  ..._argos,
  /** Start watching console.* and forwarding to os_log. */
  watch,
  /** Stop watching and restore original console methods. */
  unwatch,
};
