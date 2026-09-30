#import <React/RCTBridgeModule.h>

// This file bridges the Swift implementation to React Native's module system.
// On new arch, the interop layer handles TurboModule routing automatically.

@interface RCT_EXTERN_MODULE(Argos, NSObject)

RCT_EXTERN_METHOD(log:(NSString *)level
                  subsystem:(NSString *)subsystem
                  category:(NSString *)category
                  message:(NSString *)message)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
