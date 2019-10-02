import React from 'react';
import {Button, View, Text} from 'react-native';
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation'; // Version can be specified in package.json
import Dashboard from './pages/Dashboard';
import Add from './pages/Add';
import Details from './pages/Details'
import Edit from './pages/Edit'

const RootStack = createSwitchNavigator(
  {
    Dashboard: Dashboard,
    Add: Add,
    Details: Details,
    Edit: Edit
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
