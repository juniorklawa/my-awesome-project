
import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation'; // Version can be specified in package.json
import { View } from 'react-native';
import Dashboard from './pages/Dashboard';
import Add from './pages/Add';
import Details from './pages/Details'
import Edit from './pages/Edit'
import { fromRight, fadeIn } from 'react-navigation-transitions';
import { createStackNavigator } from 'react-navigation-stack';
import FlashMessage from "react-native-flash-message";

console.ignoredYellowBox = true

const RootStack = createStackNavigator(
  {
    Dashboard: Dashboard,
    Add: Add,
    Details: Details,
    Edit: Edit
  }, {
  initialRouteName: 'Dashboard',
  transitionConfig: () => fadeIn(),
}, {
  defaultNavigationOptions: {
    header: null
  },
}
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return (<View style={{ flex: 1 }}>
      <AppContainer />
      <FlashMessage position="bottom" />
    </View>)
  }
}


