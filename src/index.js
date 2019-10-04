/* eslint-disable prettier/prettier */
import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation'; // Version can be specified in package.json
import Dashboard from './pages/Dashboard';
import Add from './pages/Add';
import Details from './pages/Details'
import Edit from './pages/Edit'
import { zoomIn } from 'react-navigation-transitions';

const RootStack = createSwitchNavigator(
  {
    Dashboard: Dashboard,
    Add: Add,
    Details: Details,
    Edit: Edit
  }, {
  initialRouteName: 'Dashboard',
  transitionConfig: () => zoomIn(),
},
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
