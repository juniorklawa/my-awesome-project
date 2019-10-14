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
import Icon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';

export default class Details extends React.Component {

  static navigationOptions = {
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

    Alert.alert(
      'Are you sure?',
      `You are going to delete ${this.state.project.title}`,
      [
        {
          text: 'Yes', onPress: () => {
            const newProjects = this.state.projects.filter(obj => obj.key != id);
            this.setState({
              projects: newProjects,
            });

            AsyncStorage.setItem('projectss', JSON.stringify(newProjects));

            this.props.navigation.navigate('Dashboard');
          }
        },
        { text: 'No', onPress: () => { return } },
      ],
      { cancelable: true },
    );



  }

  deleteTodo(i) {
    const newTodoList = this.state.todo.filter((task, index) => index !== i)
    this.setState({
      todo: newTodoList
    })

    this.state.project.todo = this.state.todo;

    AsyncStorage.setItem('projectss', JSON.stringify(this.state.projects));
  }

  goToDashBoard() {
    this.props.navigation.navigate('Dashboard');
  }

  addTodo = async () => {
    const data = new FormData();
    data.append('todoItem', this.state.todoItem);


    if (!this.state.todoItem) {
      Alert.alert(
        'Ops!',
        'This field is obligatory',
        [
          { text: 'OK' },
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

    AsyncStorage.setItem('projectss', JSON.stringify(this.state.projects));
  };



  render() {
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
      <LinearGradient style={{ flex: 1 }} colors={['#1679D9', '#0E56B9', '#0D4DB0']}>
        <StatusBar backgroundColor="#1679D9" barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ height: 60, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <TouchableOpacity style={{ marginStart: 15 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10, }} onPress={() => this.goToDashBoard()}>
              <Icon name="chevron-thin-left" size={30} color="#fff" solid />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginEnd: 15 }}
              onPress={() => this.deleteProject(key)}>
              <Icon name="trash" size={23} color="#fff" solid />
            </TouchableOpacity>
          </View>
          <View key={key} style={styles.container}>
            <ScrollView style={{ flex: 1 }}>


              <Text
                style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 32 }]}>
                {this.state.project.title}
              </Text>
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

              <View style={{ flex: 1 }}>
                <Text style={[styles.category, { fontSize: 25 }]}>To-do</Text>
                {this.state.todo.map((task, i) => (
                  <CheckBox
                    key={i}
                    title={task.task}
                    checked={task.checked}
                    onLongPress={() => this.deleteTodo(i)}
                    onPress={() => {
                      task.checked = !task.checked;
                      this.forceUpdate();

                      const trueArray = this.state.project.todo.filter(
                        doneTasks => doneTasks.checked,
                      ).length;

                      this.state.projects
                        .filter(project => {
                          return project.key === this.state.project.key;
                        })
                        .map(project => {
                          project.todo = this.state.project.todo;
                          project.doneTasks = trueArray;
                        });

                      AsyncStorage.setItem(
                        'projectss',
                        JSON.stringify(this.state.projects),
                      );
                    }}
                  />
                ))}
              </View>


            </ScrollView>

          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',

            }}>
            <TextInput
              style={[styles.input, { flex: 10, marginLeft: 10 }]}
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
                marginRight: 15
              }}>
              <Icon name="chevron-right" size={35} color="#7159c1" solid />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    height: '100%',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
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
