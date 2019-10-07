/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { iOSUIKit } from 'react-native-typography';
import { Header, ListItem } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  StatusBar,
  Picker,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';

export default class Edit extends Component {
  state = {
    title: '',
    shortDescription: '',
    priority: '',
    worktime: '',
    tags: '',
    todoItem: '',
    date: new Date(),
    todo: [],
    projects: [],
    project: {},
    estimatedTime: '',
    estimatedInterval: '',
    projectId: null,
  };

  componentDidMount = async () => {
    const projectId = this.props.navigation.getParam('projectId', 'NO-ID');
    const data = await AsyncStorage.getItem('projectss');
    const projects = (await JSON.parse(data)) || [];
    await this.setState({
      projects: projects,
      projectId: projectId,
    });

    const detail = await this.state.projects.find(obj => obj.key === projectId);
    const todoDetail = await detail.todo;
    await this.setState({
      project: detail,
      todo: todoDetail,
    });

    await this.setState({
      title: this.state.project.title,
      shortDescription: this.state.project.shortDescription,
      tags: this.state.project.tags,
      estimatedTime: this.state.project.estimatedTime,
      estimatedInterval: this.state.project.estimatedInterval,
      category: this.state.category,
    });
  };

  addTodo = async () => {
    const data = new FormData();
    data.append('todoItem', this.state.todoItem);

    this.state.todo.push({
      task: this.state.todoItem,
    });

    this.setState({
      todoItem: '',
    });
  };

  handleSubmit = async () => {
    const data = new FormData();

    data.append('title', this.state.title);
    data.append('shorDescription', this.state.shorDescription);
    data.append('category', this.state.category);
    data.append('worktime', this.state.worktime);
    data.append('tags', this.state.tags);


    if (!this.state.title || !this.state.shortDescription) {
      Alert.alert(
        'Ops!',
        'Title and description are obligatory',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
      return
    }

    /* this.state.date =
      this.state.date.getDate() +
      '/' +
      (this.state.date.getMonth() + 1) +
      '/' +
      this.state.date.getFullYear();*/
    this.state.projects
      .filter(project => {
        console.log('project key', project.key)
        console.log('projectId', this.state.projectId)
        return project.key === this.state.projectId
      })
      .map(project => {
        project.title = this.state.title
        project.shortDescription = this.state.shortDescription,
          project.category = this.state.category,
          project.tags = this.state.tags,
          project.worktime = `${this.state.estimatedTime} ${this.state.estimatedInterval}`,
          console.log('updated project', project)
      });



    await AsyncStorage.setItem(
      'projectss',
      JSON.stringify(this.state.projects),
    );

    console.log('all projects', this.state.projects)

    this.props.navigation.navigate('Dashboard');

    /*      data = data.filter(obj => {
        return this.state.objToFind === obj.title;   
        }).map(obj, idx) => {
           console.log("found " + obj.title);
           obj.menu = this.state.menu;
           obj.title = this.state.title;
           obj.content = this.state.content;
      });  

    this.state.projects.push({
      title: this.state.title,
      shortDescription: this.state.shortDescription,
      category: this.state.category,
      tags: this.state.tags,
      worktime: `${this.state.estimatedTime} ${this.state.estimatedInterval}`,
      key: Math.random(),
      date: this.state.date,
      todo: this.state.todo,
    });


    */
  };

  goToDashBoard() {
    this.props.navigation.navigate('Dashboard');
  }

  render() {

    return (

      <SafeAreaView style={{ flex: 1, backgroundColor: '#7159c1' }}>
        <StatusBar backgroundColor="#7159c1" barStyle="light-content" />
        <Header
          placement="left"
          centerComponent={
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, { color: 'white' }]}>
              Edit your idea
            </Text>
          }
          statusBarProps={{ barStyle: 'light-content' }}
          leftComponent={
            <TouchableOpacity onPress={() => this.goToDashBoard()}>
              <Icon name="chevron-thin-left" size={23} color="#fff" solid />
            </TouchableOpacity>
          }
          barStyle="light-content" // or directly
          containerStyle={{
            backgroundColor: '#7159c1',
            justifyContent: 'space-around',
          }}
        />

        <ScrollView>
          <View style={styles.container}>
            <Image

              style={{
                width: '100%',
                height: 180,
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: 16,
                marginTop: 16,
              }}
              source={require('../icons/newidea.png')} />

            <TextInput
              style={styles.input}
              autoCorrect={false}
              placeholder="Project name"
              placeholderTextColor="#999"
              value={this.state.title}
              onChangeText={title => this.setState({ title })}
            />

            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Short description"
              placeholderTextColor="#999"
              value={this.state.shortDescription}
              onChangeText={shortDescription =>
                this.setState({ shortDescription })
              }
            />

            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Tags"
              placeholderTextColor="#999"
              value={this.state.tags}
              onChangeText={tags => this.setState({ tags })}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginStart: 5,
              }}>
              <Text style={{ color: '#666', fontSize: 15 }}>Estimate time: </Text>

              <RNPickerSelect
                onValueChange={(value) => this.setState({ estimatedTime: value })}
                items={[
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                  { label: '4', value: '4' },
                  { label: '5', value: '5' },
                  { label: '6', value: '6' },
                  { label: '7', value: '7' },
                  { label: '8', value: '8' },
                  { label: '9', value: '9' },
                  { label: '10', value: '10' },
                ]}
              />

              <RNPickerSelect
                onValueChange={(value) => this.setState({ estimatedInterval: value })}
                items={[
                  { label: 'days', value: 'days' },
                  { label: 'weeks', value: 'weeks' },
                  { label: 'months', value: 'months' },
                  { label: 'years', value: 'years' },
                ]}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginStart: 5,
              }}>
              <Text style={{ color: '#666', fontSize: 15 }}>Category</Text>
              <RNPickerSelect
                onValueChange={(value) => this.setState({ category: value })}
                items={[
                  { label: 'Mobile App', value: 'Mobile App' },
                  { label: 'Desktop App', value: 'Desktop App' },
                  { label: 'Tool', value: 'Tool' },
                  { label: 'Bot', value: 'Bot' },
                  { label: 'Other', value: 'Other' },
                ]}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}></View>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => this.handleSubmit()}>
              <Text style={styles.shareButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#ECEFF1',
    flex: 1,
    minHeight: '100%',
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});
