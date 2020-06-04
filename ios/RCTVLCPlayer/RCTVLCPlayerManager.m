#import "RCTVLCPlayerManager.h"
#import "RCTVLCPlayer.h"
#import "React/RCTBridge.h"

@implementation RCTVLCPlayerManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view
{
    return [[RCTVLCPlayer alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_VIEW_PROPERTY(source, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(paused, BOOL);
RCT_EXPORT_VIEW_PROPERTY(seek, float);
RCT_EXPORT_VIEW_PROPERTY(rate, float);
RCT_EXPORT_VIEW_PROPERTY(muted, BOOL);
RCT_EXPORT_VIEW_PROPERTY(volume, int);
RCT_EXPORT_VIEW_PROPERTY(volumeUp, int);
RCT_EXPORT_VIEW_PROPERTY(volumeDown, int);
RCT_EXPORT_VIEW_PROPERTY(resume, BOOL);
RCT_EXPORT_VIEW_PROPERTY(clear, BOOL);
RCT_EXPORT_VIEW_PROPERTY(seekTime, int);
RCT_EXPORT_VIEW_PROPERTY(videoAspectRatio, NSString);
RCT_EXPORT_VIEW_PROPERTY(snapshotPath, NSString);
/* Should support: onLoadStart, onLoad, and onError to stay consistent with Image */
/*RCT_EXPORT_VIEW_PROPERTY(onVideoPaused, RCTBubblingEventBlock);
 RCT_EXPORT_VIEW_PROPERTY(onVideoStopped, RCTBubblingEventBlock);
 RCT_EXPORT_VIEW_PROPERTY(onVideoBuffering, RCTBubblingEventBlock);
 RCT_EXPORT_VIEW_PROPERTY(onVideoPlaying, RCTBubblingEventBlock);
 RCT_EXPORT_VIEW_PROPERTY(onVideoEnded, RCTBubblingEventBlock);
 RCT_EXPORT_VIEW_PROPERTY(onVideoError, RCTBubblingEventBlock);
 RCT_EXPORT_VIEW_PROPERTY(onVideoOpen, RCTBubblingEventBlock);
 */
RCT_EXPORT_VIEW_PROPERTY(onVideoLoadStart, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoProgress, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onSnapshot, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onIsPlaying, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoStateChange, RCTBubblingEventBlock);


+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
