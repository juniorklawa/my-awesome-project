/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { CheckBox, Input } from 'react-native-elements';
import { iOSUIKit } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';

export default class Details extends React.Component {

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    headerStyle: {
      backgroundColor: '#7159c1',
    },
    header: null,
  };

  state = {
    projects: [],
    project: {},
    todo: [],
    todoItem: '',
    checked: false,
    doneTasks: 0,
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
  }

  deleteProject(id) {
    const newProjects = this.state.projects.filter(obj => obj.key != id);
    this.setState({
      projects: newProjects,
    });

    AsyncStorage.setItem('projectss', JSON.stringify(newProjects));

    this.props.navigation.navigate('Dashboard');
  }

  deleteTodo(i) {


    let filteredTodo = this.state.todo.filter((item, index) => index !== i)
    this.setState({
      todo: filteredTodo
    })

    console.log(this.state.todo)
    this.forceUpdate()

    AsyncStorage.setItem('projectss', JSON.stringify(this.state.projects));

  }

  goToDashBoard() {
    this.props.navigation.navigate('Dashboard');
  }

  addTodo() {
    const data = new FormData();
    data.append('todoItem', this.state.todoItem);

    if (!this.state.todoItem) {
      Alert.alert('Ops!', 'This field is obligatory', [{ text: 'OK' }], {
        cancelable: false,
      });
      return;
    }

    this.state.todo.push({
      task: this.state.todoItem,
      checked: false,
    });

    this.setState({
      todoItem: ''
    })

    this.forceUpdate()


    AsyncStorage.setItem('projectss', JSON.stringify(this.state.projects));
  };

  render() {
    const { todo } = this.state;
    console.log(todo)
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
      <SafeAreaView style={{ backgroundColor: '#fbfbfb', flex: 1 }}>
        <Header
          placement="left"
          centerComponent={
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, { color: 'white' }]}>
              {this.state.project.title}
            </Text>
          }
          statusBarProps={{ barStyle: 'light-content' }}
          leftComponent={
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.goToDashBoard()}>
              <Icon name="chevron-thin-left" size={23} color="#fff" solid />
            </TouchableOpacity>
          }
          rightComponent={
            <TouchableOpacity
              style={{ marginRight: 10 }}
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
        <ScrollView style={{ flex: 1 }}>
          <View key={key} style={styles.container}>
            <Text
              style={[
                iOSUIKit.subheadEmphasized,
                { color: '#929699', fontSize: 14, marginTop: -10 },
              ]}>
              Created at {date}
            </Text>
            <Text
              style={[
                iOSUIKit.bodyWhite,
                { color: '#363a3f', fontSize: 15, marginTop: 10 },
              ]}>
              Description: {shortDescription}
            </Text>

            <Text style={styles.tags}>Tags: {tags}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.category}>Category: {category}</Text>
            </View>

            <Text
              style={[iOSUIKit.bodyWhite, { color: '#363a3f', fontSize: 15 }]}>
              Estimate to finish {worktime}
            </Text>

            <View>
              <Text style={[styles.category, { fontSize: 25 }]}>To-do</Text>
              {todo.map((task, i) => (
                <CheckBox
                  key={i}
                  title={this.state.project.todo[i].task}
                  checked={this.state.project.todo[i].checked}
                  onLongPress={() => this.deleteTodo(i)}
                  onPress={() => {
                    this.state.project.todo[i].checked = !this.state.project
                      .todo[i].checked;;
                    this.forceUpdate();;

                    const trueArray = this.state.project.todo.filter(
                      doneTasks => doneTasks.checked,
                    ).length;;

                    this.state.projects
                      .filter(project => {
                        return project.key === this.state.project.key;;
                      })
                      .map(project => {
                        project.todo = this.state.project.todo;;
                        project.doneTasks = trueArray;;
                      });

                    AsyncStorage.setItem(
                      'projectss',
                      JSON.stringify(this.state.projects),
                    );
                  }}
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
            backgroundColor: '#fbfbfb',
          }}>
          <TextInput
            style={[styles.input, { flex: 10, marginHorizontal: 10 }]}
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
              marginRight: 15,
            }}>
            <Icon name="chevron-right" size={30} color="#7159c1" solid />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    minHeight: '100%',
    backgroundColor: '#fff',
  },
  category: {
    fontWeight: 'bold',
  },
  projectContainer: {
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
