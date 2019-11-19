import React, { Component } from 'react';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { View, StyleSheet } from 'react-native';

export default class Placeholder extends Component {
  render() {
    return (
      <View>
        <ShimmerPlaceHolder style={styles.placeHolder} autoRun={true} />
        <ShimmerPlaceHolder style={styles.placeHolder} autoRun={true} />
        <ShimmerPlaceHolder style={styles.placeHolder} autoRun={true} />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  placeHolder: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 5,
    width: '98%',
    height: 150
  }
});
