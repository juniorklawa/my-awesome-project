/* eslint-disable prettier/prettier */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {CheckBox} from 'react-native-elements';
import {iOSUIKit} from 'react-native-typography';
import {SafeAreaView} from 'react-navigation';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';

export default class Details extends React.Component {
  state = {
    projects: [],
    project: {},
    todo: [],
    checked: false,
  };

  async componentDidMount() {
    const projectId = this.props.navigation.getParam('projectId', 'NO-ID');
    const data = await AsyncStorage.getItem('projectss');
    const projects = (await JSON.parse(data)) || [];
    this.setState({
      projects: projects,
    });

    const detail = await this.state.projects.find(obj => obj.key === projectId);
    const todoDetail = await detail.todo;
    this.setState({
      project: detail,
      todo: todoDetail,
    });

    console.log(this.state.todo)
  }

  deleteProject(id) {
    const newProjects = this.state.projects.filter(obj => obj.key != id);
    this.setState({
      projects: newProjects,
    });

    AsyncStorage.setItem('projectss', JSON.stringify(newProjects));

    this.props.navigation.navigate('Dashboard');
  };

  goToDashBoard() {
    this.props.navigation.navigate('Dashboard');
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
      <SafeAreaView style={{backgroundColor: '#7159c1'}}>
        <Header
          placement="left"
          centerComponent={
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, {color: 'white'}]}>
              {this.state.project.title}
            </Text>
          }
          statusBarProps={{barStyle: 'light-content'}}
          leftComponent={
            <TouchableOpacity onPress={() => this.goToDashBoard()}>
              <Icon name="chevron-thin-left" size={23} color="#fff" solid />
            </TouchableOpacity>
          }
          rightComponent={
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => this.deleteProject(key)}>
              <Icon name="trash" size={23} color="#fff" solid />
            </TouchableOpacity>
          }
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

          <View>
            <Text style={[styles.category, {fontSize: 25}]}>To-do</Text>
            {todo.map(task => (
              <CheckBox
                title={task.task}
                checked={task.checked}
                onPress={() => this.setState({checked: !task.checked})}
              />
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
    minHeight: '100%',
    height: 500,
    backgroundColor: '#fff'
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
