/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { iOSUIKit } from 'react-native-typography';
import { Header, ListItem } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { Input as RInput } from 'react-native-elements'
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
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';

export default class New extends Component {
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
    estimatedTime: '',
    estimatedInterval: '',
    doneTasks: 0
  };

  componentDidMount = async () => {
    const data = await AsyncStorage.getItem('projectss');
    this.state.projects = (await JSON.parse(data)) || [];
    await this.setState({
      projects: projects,
    });
    console.log(this.state.projects);
  };

  addTodo = async () => {
    const data = new FormData();
    data.append('todoItem', this.state.todoItem);


    if (!this.state.todoItem) {
      Alert.alert(
        'Ops!',
        'This field is obligatory',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
      return
    }

    this.state.todo.push({
      task: this.state.todoItem,
      checked: false,
    });

    this.setState({
      todoItem: '',
    });

    console.log(this.state.todo);
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

    this.state.date =
      this.state.date.getDate() +
      '/' +
      (this.state.date.getMonth() + 1) +
      '/' +
      this.state.date.getFullYear();

    this.state.projects.push({
      title: this.state.title,
      shortDescription: this.state.shortDescription,
      category: this.state.category,
      tags: this.state.tags,
      worktime: `${this.state.estimatedTime} ${this.state.estimatedInterval}`,
      key: Math.random(),
      date: this.state.date,
      todo: this.state.todo,
      doneTasks: this.state.doneTasks
    });

    await AsyncStorage.setItem(
      'projectss',
      JSON.stringify(this.state.projects),
    );

    console.log(this.state.projects);

    this.props.navigation.navigate('Dashboard');
  };

  goToDashBoard() {
    this.props.navigation.navigate('Dashboard');
  }

  render() {
    StatusBar.setBarStyle('light-content', true);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#7159c1' }}>
        <Header
          placement="left"
          centerComponent={
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, { color: 'white' }]}>
              What's your idea?
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

          <RNPickerSelect
                  style={{ width: '100%' }}
                  onValueChange={(value) => this.setState({ category: value })}
                  items={[
                    { label: 'Mobile App', value: 'Mobile App' },
                    { label: 'Desktop App', value: 'Desktop App' },
                    { label: 'Tool', value: 'Tool' },
                    { label: 'Bot', value: 'Bot' },
                    { label: 'Other', value: 'Other' },
                  ]}
                />
            <Image
              style={{
                width: '100%',
                height: 180,
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: 16,
                marginTop: 16,
              }}

              source={require('../icons/newidea.png')}></Image>

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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <RNPickerSelect
                  style={{ width: '100%' }}
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
                  style={{ width: '100%' }}
                  onValueChange={(value) => this.setState({ estimatedInterval: value })}
                  items={[
                    { label: 'days', value: 'days' },
                    { label: 'weeks', value: 'weeks' },
                    { label: 'months', value: 'months' },
                    { label: 'years', value: 'years' },
                  ]}
                />
              </View>

            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginStart: 5,
              }}>
              <Text style={{ color: '#666', fontSize: 15 }}>Category</Text>
              <View style={{ marginLeft: 20 }}>
                <RNPickerSelect
                  style={{ width: '100%' }}
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
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextInput
                style={[styles.input, { flex: 5 }]}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="To-do"
                placeholderTextColor="#999"
                value={this.state.todoItem}
                onChangeText={todoItem => this.setState({ todoItem })}
              />
              <TouchableOpacity
                onPress={() => this.addTodo()}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <Icon name="plus" size={40} color="#7159c1" solid />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10 }}>
              {this.state.todo.map((l, i) => (
                <ListItem
                  bottomDivider
                  containerStyle={{ marginRight: 50, backgroundColor: '#ECEFF1' }}
                  key={i}
                  title={l.task}
                  rightIcon={<Icon name="trash" size={23} color="#666" solid />}
                />
              ))}
            </View>

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
