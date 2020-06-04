import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class TimeLimt extends Component {
  constructor(props) {
    super(props);
    this.timer = null;

    this.state = {
      timeNumber: 0,
    };
  }

  static defaultProps = {
    maxTime: 0,
  };

  componentDidMount() {
    if (this.props.maxTime > 0) {
      this.timer = setInterval(this._updateTimer, 1000);
    }
  }

  _updateTimer = () => {
    const { timeNumber } = this.state;
    const { maxTime } = this.props;
    const newTimeNumber = timeNumber + 1;
    this.setState({
      timeNumber: newTimeNumber,
    });
    if (newTimeNumber >= maxTime) {
      this._onEnd();
    }
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  _onEnd = () => {
    let { onEnd } = this.props;
    clearInterval(this.timer);
    onEnd && onEnd();
  };

  render() {
    const { timeNumber } = this.state;
    const { maxTime } = this.props;
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={this._onEnd}
        activeOpacity={1}>
        {maxTime > 0 && (
          <View style={styles.timeView}>
            <Text style={{ color: 'green', fontSize: 13 }}>{maxTime - timeNumber}</Text>
          </View>
        )}
        <View style={styles.nameView}>
          <Text style={{ fontSize: 13 }}>Skip</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  nameView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
