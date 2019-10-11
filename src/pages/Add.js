/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { iOSUIKit } from 'react-native-typography';
import { Header, ListItem } from 'react-native-elements';
import { withNavigationFocus } from 'react-navigation';
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

class New extends Component {


  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    headerStyle: {
      backgroundColor: '#7159c1',
    },
    header: null,
  };

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
  };

  deleteTodo(i) {
    let filteredTodo = this.state.todo.filter((item, index) => index !== i)
    this.setState({
      todo: filteredTodo
    })
  }

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
      worktime: this.state.worktime,
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ECEFF1' }}>
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
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.goToDashBoard()}>
              <Icon name="chevron-thin-left" size={23} color="#fff" solid />
            </TouchableOpacity>
          }
          barStyle="light-content" // or directly
          containerStyle={{
            backgroundColor: '#7159c1',
            justifyContent: 'space-around',
          }}
        />

        <ScrollView ref={ref => this.scrollView = ref}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.scrollView.scrollToEnd({ animated: true });
          }}>
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
              placeholder="Project name"
              placeholderTextColor="#999"
              value={this.state.title}
              onChangeText={title => this.setState({ title })}
            />

            <TextInput
              style={styles.input}
              autoCorrect={false}
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

            <TextInput
              style={styles.input}
              autoCorrect={false}
              placeholder="Estimated time"
              placeholderTextColor="#999"
              value={this.state.worktime}
              onChangeText={worktime => this.setState({ worktime })}
            />


            <TextInput
              style={styles.input}
              autoCorrect={false}
              placeholder="Category"
              placeholderTextColor="#999"
              value={this.state.category}
              onChangeText={category => this.setState({ category })}
            />



            <View style={{ marginTop: 10 }}>
              {this.state.todo.map((l, i) => (
                <ListItem
                  bottomDivider
                  containerStyle={{ marginRight: 50, backgroundColor: '#ECEFF1' }}
                  key={i}
                  title={l.task}
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => this.deleteTodo(i)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Icon name="trash" size={23} color="#666" solid />
                    </TouchableOpacity>
                  }
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 10
          }}>
          <TextInput
            style={[styles.input, { flex: 10 }]}
            autoCorrect={false}
            placeholder="Add new todo"
            onSubmitEditing={() => this.addTodo()}
            placeholderTextColor="#999"
            value={this.state.todoItem}
            onChangeText={todoItem => this.setState({ todoItem })}
          />
          <TouchableOpacity
            onPress={() => this.addTodo()}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Icon name="chevron-right" size={35} color="#7159c1" solid />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => this.handleSubmit()}>
          <Text style={styles.shareButtonText}>Add</Text>
        </TouchableOpacity>
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
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});

export default withNavigationFocus(New);
