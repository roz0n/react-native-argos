import OSLog
import Foundation

@objc(Argos)
class Argos: NSObject {

  // Cache loggers by "subsystem:category" to avoid creating a new Logger on every call
  private var loggerCache: [String: Logger] = [:]
  private let cacheLock = NSLock()

  @objc static func requiresMainQueueSetup() -> Bool { false }

  private func logger(subsystem: String, category: String) -> Logger {
    // Resolve the __bundle_id__ sentinel to the actual bundle identifier
    let resolvedSubsystem = subsystem == "__bundle_id__"
      ? (Bundle.main.bundleIdentifier ?? "com.unknown")
      : subsystem

    let key = "\(resolvedSubsystem):\(category)"

    cacheLock.lock()
    defer { cacheLock.unlock() }

    if let cached = loggerCache[key] { return cached }
    let newLogger = Logger(subsystem: resolvedSubsystem, category: category)
    loggerCache[key] = newLogger
    return newLogger
  }

  // IMPORTANT: Messages must be marked `.public` — without this, os_log redacts
  // dynamic string content in non-debug builds and you'll see "<private>" in Console.app.
  @objc(log:subsystem:category:message:)
  func log(_ level: String, subsystem: String, category: String, message: String) {
    let l = logger(subsystem: subsystem, category: category)
    switch level {
    case "debug":
      l.debug("\(message, privacy: .public)")
    case "info":
      l.info("\(message, privacy: .public)")
    case "warning":
      l.warning("\(message, privacy: .public)")
    case "error":
      l.error("\(message, privacy: .public)")
    case "fault":
      l.fault("\(message, privacy: .public)")
    default:
      l.log("\(message, privacy: .public)")
    }
  }
}
