import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  StatusBar,
  Picker,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { CheckBox } from 'react-native-elements'
import {iOSUIKit} from 'react-native-typography';
import {SafeAreaView} from 'react-navigation';
import {Header} from 'react-native-elements';

export default class Details extends React.Component {
  state = {
    project: {},
    todo: [],
  };

  async componentDidMount() {
    const projectId = this.props.navigation.getParam('projectId', 'NO-ID');
    const data = await AsyncStorage.getItem('projectss');
    const projects = (await JSON.parse(data)) || [];
    await this.setState({
      projects: projects,
    });

    const detail = await this.state.projects.find(obj => obj.key === projectId);
    const todoDetail = await detail.todo;
    await this.setState({
      project: detail,
      todo: todoDetail,
    });
  }

  async deleteProject(id) {
    const newProjects = this.state.projects.filter(obj => obj.key != id);
    this.setState({
      projects: newProjects,
    });

    await AsyncStorage.setItem(
      'projectss',
      JSON.stringify(this.state.projects),
    );
  }

  render() {
    const {todo} = this.state;
    todo.map(task => console.log(task.task));
    StatusBar.setBarStyle('light-content', true);
    const {
      key,
      title,
      shortDescription,
      tags,
      category,
      worktime,
      date,
    } = this.state.project;
    return (
      <SafeAreaView>
        <Header
          placement="left"
          centerComponent={
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, {color: 'white'}]}>
              {this.state.project.title}
            </Text>
          }
          statusBarProps={{barStyle: 'light-content'}}
          leftComponent={{icon: 'star', style: {color: '#fff'}}}
          barStyle="light-content" // or directly
          containerStyle={{
            backgroundColor: '#7159c1',
            justifyContent: 'space-around',
          }}
        />

        <View key={key} style={styles.container}>
          <Text
            style={[
              iOSUIKit.subheadEmphasized,
              {color: '#929699', fontSize: 14, marginTop: -10},
            ]}>
            Created at {date}
          </Text>
          <Text
            style={[
              iOSUIKit.bodyWhite,
              {color: '#363a3f', fontSize: 15, marginTop: 10},
            ]}>
            Description: {shortDescription}
          </Text>

          <Text style={styles.tags}>Tags: {tags}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.category}>Category: {category}</Text>
          </View>

          <Text style={[iOSUIKit.bodyWhite, {color: '#363a3f', fontSize: 15}]}>
            Estimate to finish {worktime}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.category, {fontSize: 25}]}>To-do</Text>
          </View>
          <View
            style={{
              width: '100%',
              height: 100,
              borderRadius: 5,
              backgroundColor: 'white',
            }}>
            {todo.map(task => (
              <View>
                <Text>{task.task}</Text>
                <CheckBox title="Click Here"/>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ECEFF1',
    minHeight: '100%',
    height: 500,
  },
  category: {
    fontWeight: 'bold',
  },
  movieContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  moviePlot: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 24,
  },

  movieButton: {
    height: 42,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#E8B708',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  tags: {
    color: '#7159c1',
    fontWeight: 'bold',
  },

  movieButtonText: {
    fontSize: 16,
    color: '#E8B708',
    fontWeight: 'bold',
  },
});
