import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressCircle from 'react-native-progress-circle';
import { Badge } from 'react-native-elements'
import moment from 'moment';
import { themes } from '../providers/themesProvider'

export default class ThemeButton extends Component {



  render() {
    const { color, title } = this.props
    return (
      <View
        style={{ backgroundColor: color, marginHorizontal: 20, marginBottom: 20, height: 45, borderRadius: 5, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ marginLeft: 16, color: '#fff', fontFamily: 'Gilroy-Bold', fontSize: 16 }}>
          {title}
        </Text>
      </View>
    );
  }
}


