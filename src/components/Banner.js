import React, { Component } from 'react';
import { View } from 'react-native';
import { AdMobBanner } from 'react-native-admob'
export default class Banner extends Component {



  render() {
    const { isPro } = this.props

    //dev
    //const adUnitId = "ca-app-pub-3940256099942544/6300978111"
    // //prod
     const adUnitId = "ca-app-pub-1120115677806043/6558099870"

    return (
      isPro === false &&
      <View
        style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <AdMobBanner
          adSize="banner"
          adUnitID={adUnitId}
          onAdFailedToLoad={error => console.error(error)}
        />
      </View>
    );
  }
}


