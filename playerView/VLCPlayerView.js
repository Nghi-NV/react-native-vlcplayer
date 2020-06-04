import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import VLCPlayer from '../VLCPlayer';
import PropTypes from 'prop-types';
import TimeLimt from './TimeLimit';
import ControlBtn from './ControlBtn';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStatusBarHeight } from './SizeController';

const statusBarHeight = getStatusBarHeight();

export default class VLCPlayerView extends Component {
  static propTypes = {
    uri: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      isLoading: true,
      loadingSuccess: false,
      isFull: false,
      currentTime: 0.0,
      totalTime: 0.0,
      showControls: false,
      seek: 0,
      isError: false,
    };
    this.touchTime = 0;
    this.changeUrl = false;
    this.isEnding = false;
    this.reloadSuccess = false;
  }

  static defaultProps = {
    initPaused: false,
    source: null,
    seek: 0,
    playInBackground: false,
    isAd: false,
    autoplay: true,
  };

  componentDidMount() {
    if (this.props.isFull) {
      this.setState({
        showControls: true,
      });
    }
  }

  componentWillUnmount() {
    if (this.bufferInterval) {
      clearInterval(this.bufferInterval);
      this.bufferInterval = null;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.uri !== prevProps.uri) {
      this.changeUrl = true;
    }
  }

  render() {
    const {
      onEnd,
      style,
      isAd,
      type,
      isFull,
      uri,
      title,
      onLeftPress,
      closeFullScreen,
      showBack,
      showTitle,
      videoAspectRatio,
    } = this.props;
    const { isLoading, loadingSuccess, showControls, isError } = this.state;

    let showAd = false;
    let realShowLoding = false;
    let source = {};

    if (uri) {
      if (uri.split) {
        source = { uri: this.props.uri };
      } else {
        source = uri;
      }
    }

    if (Platform.OS === 'ios') {
      if ((loadingSuccess && isAd) || (isAd && type === 'swf')) {
        showAd = true;
      }
      if (isLoading && type !== 'swf') {
        realShowLoding = true;
      }
    } else {
      if (loadingSuccess && isAd) {
        showAd = true;
      }
      if (isLoading) {
        realShowLoding = true;
      }
    }

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.videoBtn, style]}
        onPressOut={() => {
          let currentTime = new Date().getTime();
          if (this.touchTime === 0) {
            this.touchTime = currentTime;
            this.setState({ showControls: !this.state.showControls });
          } else {
            if (currentTime - this.touchTime >= 500) {
              this.touchTime = currentTime;
              this.setState({ showControls: !this.state.showControls });
            }
          }
        }}>
        <VLCPlayer
          ref={ref => (this.vlcPlayer = ref)}
          paused={this.state.paused}
          style={[styles.video]}
          source={source}
          videoAspectRatio={videoAspectRatio}
          onProgress={this.onProgress.bind(this)}
          onEnd={this.onEnded.bind(this)}
          onStopped={this.onEnded.bind(this)}
          onPlaying={this.onPlaying.bind(this)}
          onBuffering={this.onBuffering.bind(this)}
          onPaused={this.onPaused.bind(this)}
          progressUpdateInterval={250}
          onError={this._onError}
          onOpen={this._onOpen}
          onLoadStart={this._onLoadStart}
        />
        {realShowLoding &&
          !isError && (
            <View style={styles.loading}>
              <ActivityIndicator size={'large'} animating={true} color="#fff" />
            </View>
          )}
        {isError && (
          <View style={[styles.loading, { backgroundColor: '#000' }]}>
            <Text style={{ color: 'red' }}>Video playback error, please reload</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this._reload}
              style={{
                width: 100,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Icon name={'reload'} size={45} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.topView}>
          <View style={styles.backBtn}>
            {showBack && (
              <TouchableOpacity
                onPress={() => {
                  if (isFull) {
                    closeFullScreen && closeFullScreen();
                  } else {
                    onLeftPress && onLeftPress();
                  }
                }}
                style={styles.btn}
                activeOpacity={0.8}>
                <Icon name={'chevron-left'} size={30} color="#fff" />
              </TouchableOpacity>
            )}
            <View style={{ justifyContent: 'center', flex: 1, marginRight: 10 }}>
              {showTitle &&
                showControls && (
                  <Text style={{ color: '#fff', fontSize: 16 }} numberOfLines={1}>
                    {title}
                  </Text>
                )}
            </View>
            {showAd && (
              <View style={styles.ad}>
                <TimeLimt
                  onEnd={() => {
                    onEnd && onEnd();
                  }}
                />
              </View>
            )}
          </View>
        </View>
        <View style={[styles.bottomView]}>
          {showControls && (
            <ControlBtn
              showSlider={!isAd}
              showAd={showAd}
              onEnd={onEnd}
              title={title}
              onLeftPress={onLeftPress}
              paused={this.state.paused}
              isFull={isFull}
              currentTime={this.state.currentTime}
              totalTime={this.state.totalTime}
              onPausedPress={this._play}
              onFullPress={this._toFullScreen}
              onValueChange={value => {
                this.changingSlider = true;
                this.setState({
                  currentTime: value,
                });
              }}
              onSlidingComplete={value => {
                this.changingSlider = false;
                if (Platform.OS === 'ios') {
                  this.vlcPlayer.seek(Number((value / this.state.totalTime).toFixed(17)));
                } else {
                  this.vlcPlayer.seek(value);
                }
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * @param event
   */
  onPlaying(event) {
    this.isEnding = false;
    if (this.state.paused) {
      this.setState({ paused: false });
    }
    console.log('onPlaying');
  }

  /**
   * @param event
   */
  onPaused(event) {
    if (!this.state.paused) {
      this.setState({ paused: true, showControls: true });
    } else {
      this.setState({ showControls: true });
    }
    console.log('onPaused');
  }

  /**
   * @param event
   */
  onBuffering(event) {
    this.setState({
      isLoading: true,
      isError: false,
    });
    this.bufferTime = new Date().getTime();
    if (!this.bufferInterval) {
      this.bufferInterval = setInterval(this.bufferIntervalFunction, 250);
    }
    console.log('onBuffering', event);
  }

  bufferIntervalFunction = () => {
    console.log('bufferIntervalFunction');
    const currentTime = new Date().getTime();
    const diffTime = currentTime - this.bufferTime;
    if (diffTime > 1000) {
      clearInterval(this.bufferInterval);
      this.setState({
        paused: true,
      }, () => {
        this.setState({
          paused: false,
          isLoading: false,
        });
      });
      this.bufferInterval = null;
      console.log('remove bufferIntervalFunction');
    }
  };

  _onError = e => {
    console.log('_onError', e);
    this.reloadSuccess = false;
    this.setState({
      isError: true,
    });
  };

  _onOpen = e => {
    console.log('onOpen', e);
  };

  _onLoadStart = e => {
    console.log('_onLoadStart', e);
    const { isError, currentTime, totalTime } = this.state;
    if (isError) {
      this.reloadSuccess = true;
      if (Platform.OS === 'ios') {
        this.vlcPlayer.seek(Number((currentTime / totalTime).toFixed(17)));
      } else {
        this.vlcPlayer.seek(currentTime);
      }
      this.setState({
        paused: true,
        isError: false,
      }, () => {
        this.setState({
          paused: false,
        });
      })
    } else {
      this.vlcPlayer.seek(0);
      this.setState({
        isLoading: true,
        isError: false,
        loadingSuccess: false,
        paused: true,
        currentTime: 0.0,
        totalTime: 0.0,
      }, () => {
        this.setState({
          paused: false,
        });
      })
    }
  };

  _reload = () => {
    if (!this.reloadSuccess) {
      this.vlcPlayer.resume && this.vlcPlayer.resume(false);
    }
  };

  /**
   * @param event
   */
  onProgress(event) {
    const currentTime = event.currentTime;
    let loadingSuccess = false;
    if (currentTime > 0 || this.state.currentTime > 0) {
      loadingSuccess = true;
    }
    if (!this.changingSlider) {
      if (currentTime === 0 || currentTime === this.state.currentTime * 1000) {
      } else {
        this.setState({
          loadingSuccess: loadingSuccess,
          isLoading: false,
          isError: false,
          progress: event.position,
          currentTime: event.currentTime / 1000,
          totalTime: event.duration / 1000,
        });
      }
    }
  }

  /**
   * @param event
   */
  onEnded(event) {
    console.log('onEnded ---------->')
    console.log(event)
    console.log('<---------- onEnded ')
    let { currentTime, totalTime } = this.state;
    let { onEnd, isAd } = this.props;
    if (((currentTime + 5) >= totalTime && totalTime > 0) || isAd) {
      this.setState({ paused: true }, () => {
        if (!this.isEnding) {
          onEnd && onEnd();
          if (!isAd) {
            this.vlcPlayer.resume && this.vlcPlayer.resume(false);
            console.log(this.props.uri + ':   onEnded');
          }
          this.isEnding = true;
        }
      },
      );
    }
  }

  _toFullScreen = () => {
    let { startFullScreen, closeFullScreen, isFull } = this.props;
    if (isFull) {
      closeFullScreen && closeFullScreen();
    } else {
      startFullScreen && startFullScreen();
    }
  };

  _play = () => {
    this.setState({ paused: !this.state.paused });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoBtn: {
    flex: 1,
  },
  video: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ad: {
    backgroundColor: 'rgba(255,255,255,1)',
    height: 30,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topView: {
    top: Platform.OS === 'ios' ? statusBarHeight : 0,
    left: 0,
    height: 45,
    position: 'absolute',
    width: '100%'
  },
  bottomView: {
    bottom: 0,
    left: 0,
    height: 50,
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  backBtn: {
    height: 45,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: 40,
    borderRadius: 20,
    width: 40,
    paddingTop: 3,
  },
});
