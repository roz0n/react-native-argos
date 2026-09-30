import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Send a log message to Apple's os_log system.
   * @param level   - 'debug' | 'info' | 'warning' | 'error' | 'fault'
   * @param subsystem - Reverse-DNS identifier, e.g. "com.mycompany.myapp"
   * @param category  - Free-form label to filter by in Console.app, e.g. "Auth"
   * @param message   - The log message string
   */
  log(
    level: string,
    subsystem: string,
    category: string,
    message: string
  ): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Argos');
