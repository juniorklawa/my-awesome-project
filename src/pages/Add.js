import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {iOSUIKit} from 'react-native-typography';
import {Header} from 'react-native-elements';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  StatusBar,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-navigation';

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

    this.state.todo.push({
      task: this.state.todoItem,
    });

    console.log(this.state.todo)
  };

  handleSubmit = async () => {
    const data = new FormData();

    data.append('title', this.state.title);
    data.append('shorDescription', this.state.shorDescription);
    data.append('category', this.state.category);
    data.append('worktime', this.state.worktime);
    data.append('tags', this.state.tags);

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
      worktime: this.state.worktime,
      key: Math.random(),
      date: this.state.date,
      todo: this.state.todo,
    });

    await AsyncStorage.setItem(
      'projectss',
      JSON.stringify(this.state.projects),
    );

    console.log(this.state.projects);

    this.props.navigation.navigate('Dashboard');
  };

  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header
          placement="left"
          centerComponent={
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, {color: 'white'}]}>
              What's your idea?
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
              source={require('../icons/newidea.png')}></Image>

            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Project name"
              placeholderTextColor="#999"
              value={this.state.title}
              onChangeText={title => this.setState({title})}
            />

            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Short description"
              placeholderTextColor="#999"
              value={this.state.shortDescription}
              onChangeText={shortDescription =>
                this.setState({shortDescription})
              }
            />

            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Tags"
              placeholderTextColor="#999"
              value={this.state.tags}
              onChangeText={tags => this.setState({tags})}
            />

            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Duration preview"
              placeholderTextColor="#999"
              value={this.state.worktime}
              onChangeText={worktime => this.setState({worktime})}
            />

            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Category"
              placeholderTextColor="#999"
              value={this.state.category}
              onChangeText={category => this.setState({category})}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={[styles.input, {flex: 5}]}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="To-do"
                placeholderTextColor="#999"
                value={this.state.todoItem}
                onChangeText={todoItem => this.setState({todoItem})}
              />
              <TouchableOpacity
                onPress={() => this.addTodo()}
                style={{flex: 1}}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'blue',
                  }}></View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => this.handleSubmit()}>
              <Text style={styles.shareButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
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
