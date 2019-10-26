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
  TextInput,
  Image,
  StatusBar,
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
    date: moment().format('ddd, D[th] MMMM'),
    todo: [],
    projects: [],
    estimatedTime: '',
    estimatedInterval: '',
    doneTasks: 0
  };


  static navigationOptions = {
    header: null,
  };


  componentDidMount = async () => {
    const data = await AsyncStorage.getItem('projectss');
    this.state.projects = (await JSON.parse(data)) || [];
    await this.setState({
      projects: projects,
    });
    console.log(this.state.projects);
  };

  deleteTodo(i) {
    const newTodoList = this.state.todo.filter((task, index) => index !== i)
    this.setState({
      todo: newTodoList
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

    /* this.state.date =
       this.state.date.getDate() +
       '/' +
       (this.state.date.getMonth() + 1) +
       '/' +
       this.state.date.getFullYear();*/




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

      <LinearGradient style={{ flex: 1 }} colors={['#1679D9', '#0E56B9', '#0D4DB0']}>
        <StatusBar backgroundColor="#1679D9" barStyle="light-content" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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

              <Text
                style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 24, marginTop: 16 }]}>
                Required information
            </Text>

              <Text style={{ fontWeight: 'bold', color: '#1679D9', marginTop: 16 }}>
                Project Name
              </Text>
              <TextInput
                style={styles.input}
                autoCorrect={false}
                placeholderTextColor="#999"
                value={this.state.title}
                onChangeText={title => this.setState({ title })}
              />

              <Text style={{ fontWeight: 'bold', color: '#1679D9', marginTop: 16 }}>
                Description
              </Text>

              <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor="#999"
                value={this.state.shortDescription}
                onChangeText={shortDescription =>
                  this.setState({ shortDescription })
                }
              />

              <Text
                style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 24, marginTop: 16 }]}>
                Additional information
            </Text>

              <Text style={{ fontWeight: 'bold', color: '#1679D9', marginTop: 16 }}>
                Keys
              </Text>

              <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Tags"
                placeholderTextColor="#999"
                value={this.state.tags}
                onChangeText={tags => this.setState({ tags })}
              />

              <Text style={{ fontWeight: 'bold', color: '#1679D9', marginTop: 16 }}>
                Interval time
              </Text>

              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <View>

                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Tags"
                    placeholderTextColor="#999"
                    value={this.state.tags}
                    onChangeText={tags => this.setState({ tags })}
                  />
                </View>
                <View style={styles.selectInput}>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: '100%' }}
                    value={this.state.estimatedInterval}
                    onChangeText={tags => this.setState({ estimatedInterval })}
                    placeholder="Select one option"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                  >
                    <Picker.Item label="day(s)" value="key0" />
                    <Picker.Item label="week(s)" value="key1" />
                    <Picker.Item label="months(s)" value="key2" />
                    <Picker.Item label="year(s)" value="key3" />
                  </Picker>

                </View>
              </View>


              <Text style={{ fontWeight: 'bold', color: '#1679D9', marginTop: 16 }}>
                Category
              </Text>

              <View style={styles.selectInput}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: '100%' }}
                  placeholder="Select one option"
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
              <Icon name="chevron-right" size={35} color="#0D4DB0" solid />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => this.handleSubmit()}>
            <Text style={styles.shareButtonText}>Add</Text>
          </TouchableOpacity>
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
    backgroundColor: '#0D4DB0',
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
