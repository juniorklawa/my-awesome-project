import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { iOSUIKit } from 'react-native-typography';
import { Header, ListItem } from 'react-native-elements';
import { Label, Form, Item, Picker } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Image,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';

export default class Edit extends Component {

  static navigationOptions = {

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
    project: {},
    category: '',
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
      worktime: this.state.worktime,
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
          project.worktime = this.state.estimatedTime + ' ' + this.state.estimatedInterval
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


      <LinearGradient style={{ flex: 1 }} colors={['#1679D9', '#0E56B9', '#0D4DB0']}>
        <StatusBar backgroundColor="#1679D9" barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled>
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
              <View style={{ backgroundColor: '#1679D9' }}>
                <View style={{ height: 60, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, }}>
                  <TouchableOpacity style={{ marginStart: 15 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10, }} onPress={() => this.goToDashBoard()}>
                    <Icon name="chevron-thin-left" size={30} color="#fff" solid />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[iOSUIKit.largeTitleEmphasizedObject, { color: 'white', fontSize: 32, paddingHorizontal: 18, marginBottom: 10 }]}>
                  Edit your idea
            </Text>
              </View>
              <ScrollView
                ref={(view) => {
                  this.scrollView = view;
                }}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.setState({
                    currentHeight: contentHeight
                  })
                  this.scrollView.scrollTo({ y: this.state.currentHeight });
                  console.log('current height:', this.state.currentHeight)
                }}
              >
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

                  <Text
                    style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 24, marginTop: 16 }]}>
                    Required information
            </Text>

                  <Text style={styles.labelTitle}>
                    Project Name
              </Text>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    placeholder="Ex: My Awesome Idea"
                    placeholderTextColor="#999"
                    value={this.state.title}
                    onChangeText={title => this.setState({ title })}
                  />

                  <Text style={styles.labelTitle}>
                    Description
              </Text>

                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                    value={this.state.shortDescription}
                    placeholder="Ex: An app that tracks awesome ideas"
                    onChangeText={shortDescription =>
                      this.setState({ shortDescription })
                    }
                  />

                  <Text
                    style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 24, marginTop: 16 }]}>
                    Additional information
            </Text>

                  <Text style={styles.labelTitle}>
                    Keywords
              </Text>

                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Ex: #Random #Pictures #Dogs"
                    placeholderTextColor="#999"
                    value={this.state.tags}
                    onChangeText={tags => this.setState({ tags })}
                  />

                  <Text style={styles.labelTitle}>
                    Estimated time
              </Text>

                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    <View>
                      <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="0"
                        placeholderTextColor="#999"
                        value={this.state.estimatedTime}
                        onChangeText={estimatedTime => this.setState({ estimatedTime })}
                      />
                    </View>
                    <View style={[styles.selectInput, { height: 50, marginLeft: 10 }]}>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon color='#1679D9' name="chevron-down" />}
                        style={{ width: '100%' }}
                        value={this.state.estimatedInterval}
                        onChangeText={estimatedInterval => this.setState({ estimatedInterval })}
                        placeholder="Select one option"
                        selectedValue={this.state.estimatedInterval}
                        onValueChange={estimatedInterval => this.setState({ estimatedInterval })}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                      >
                        <Picker.Item label="day(s)" value="day(s)" />
                        <Picker.Item label="week(s)" value="week(s)" />
                        <Picker.Item label="month(s)" value="month(s)" />
                        <Picker.Item label="year(s)" value="year(s)" />
                      </Picker>

                    </View>
                  </View>


                  <Text style={styles.labelTitle}>
                    Category
              </Text>

                  <View style={styles.selectInput}>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon color='#1679D9' name="chevron-down" />}
                      style={{ width: '100%' }}
                      value={this.state.category}
                      onChangeText={category => this.setState({ category })}
                      placeholder="Select one option"
                      selectedValue={this.state.category}
                      onValueChange={category => this.setState({ category })}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                    >
                      <Picker.Item label="Application" value="Application" />
                      <Picker.Item label="Website" value="Website" />
                      <Picker.Item label="Software" value="Software" />
                      <Picker.Item label="Bot" value="Bot" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>

                  </View>



                  {
                    this.state.todo.length > 0 ?
                      <Text style={{ fontWeight: 'bold', color: '#1679D9', marginTop: 16, fontSize: 24 }}>
                        To-do
                  </Text>
                      : null
                  }


                  <View style={{ marginTop: 10, flex: 1 }}>
                    {this.state.todo.map((l, i) => (
                      <ListItem
                        containerStyle={{ marginRight: 50, backgroundColor: '#ECEFF1', borderRadius: 4, marginTop: 2, marginBottom: 2 }}
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
                  <Icon name="chevron-right" size={35} color="#1679D9" solid />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => this.handleSubmit()}>
                <Text style={styles.shareButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    flex: 1,
    minHeight: '100%',
  },

  labelTitle: {
    fontWeight: 'bold',
    color: '#1679D9',
    fontSize: 16,
    marginTop: 16
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

  selectInput: {
    borderRadius: 4,
    backgroundColor: "#F7F7F7",
    padding: 5,
    flex: 1,
    marginTop: 10,
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
    backgroundColor: "#F7F7F7",
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#1679D9',
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
