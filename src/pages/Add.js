import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { iOSUIKit } from 'react-native-typography';
import { Header, ListItem, Overlay } from 'react-native-elements';
import { Label, Form, Picker } from 'native-base';
import ImagePicker from 'react-native-image-picker';
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
  FlatList,
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
    category: 'Application',
    tags: '',
    todoItem: '',
    date: moment().format('ddd, D[th] MMMM'),
    todo: [],
    projects: [],
    estimatedTime: '',
    estimatedInterval: 'day(s)',
    doneTasks: 0,
    currentHeight: null,
    isVisible: false,
    previews: [],
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


  };


  handleSelectImage = () => {

    const options = {
      title: 'Select picture',
      storageOptions: {
        skipBackup: true,
        quality: 0.1,
        path: 'myawesomeproject',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        console.log('Error');
      } else if (response.didCancel) {
        console.log('Used canceled');
      } else {

        const source = { uri: 'data:image/jpeg;base64,' + response.data };


        const image = {
          uri: source.uri,
        }

        this.state.previews.push(image.uri);


        this.setState({ preview: source });
      }
    });
  }






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
          { text: 'OK'},
        ],
        { cancelable: false },
      );
      return
    }

    await this.state.projects.push({
      title: this.state.title,
      shortDescription: this.state.shortDescription,
      category: this.state.category,
      tags: this.state.tags,
      worktime: this.state.estimatedTime + ' ' + this.state.estimatedInterval,
      estimatedTime: this.state.estimatedTime,
      estimatedInterval: this.state.estimatedInterval,
      images: this.state.previews,
      key: Math.random(),
      date: this.state.date,
      todo: this.state.todo,
      isArchived: false,
      doneTasks: this.state.doneTasks,
    });

    await AsyncStorage.setItem(
      'projectss',
      JSON.stringify(this.state.projects),
    );

    

    this.props.navigation.navigate('Dashboard');
  };

  goToDashBoard() {
    this.props.navigation.navigate('Dashboard');
  }

  render() {
    StatusBar.setBarStyle('light-content', true);
    const columns = 3;
    return (

      <LinearGradient style={{ flex: 1 }} colors={['#1679D9', '#0E56B9', '#0D4DB0']}>
        <StatusBar backgroundColor="#1679D9" barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>

          <Overlay
            height={200}
            overlayStyle={{ borderRadius: 10 }}
            onBackdropPress={() => {
              this.setState({
                isVisible: false
              })
            }}
            isVisible={this.state.isVisible}>
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 24, marginLeft: 10 }]}>
              New Category
              </Text>

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
                placeholder="Add new category"
                placeholderTextColor="#999"
                onChangeText={category => this.setState({ category })}
              />
            </View>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={(category) => {

                
                this.setState({ isVisible: false })
              }}>
              <Text style={styles.shareButtonText}>Add</Text>
            </TouchableOpacity>

          </Overlay>


          <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled>
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
              <LinearGradient colors={['#1679D9', '#0E56B9']}>
                <View style={{ height: 60, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, }}>
                  <TouchableOpacity style={{ marginStart: 15 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10, }} onPress={() => this.goToDashBoard()}>
                    <Icon name="chevron-thin-left" size={30} color="#fff" solid />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[iOSUIKit.largeTitleEmphasizedObject, { color: 'white', fontSize: 32, paddingHorizontal: 18, marginBottom: 10 }]}>
                  What's your idea?
            </Text>
              </LinearGradient>
              <ScrollView
                ref={(view) => {
                  this.scrollView = view;
                }}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.setState({
                    currentHeight: contentHeight
                  })
                  this.scrollView.scrollTo({ y: this.state.currentHeight });
                  
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
                    autoCapitalize='words'
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
                    editable
                    multiline
                    autoCorrect={false}
                    autoCapitalize="sentences"
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
                    autoCapitalize="words"
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
                        keyboardType='numeric'
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
                      onValueChange={category => {
                        if (category === 'new') {
                          this.setState({ isVisible: true })
                        } else {
                          this.setState({ category })
                        }

                      }}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                    >
                      <Picker.Item label="Application" value="Application" />
                      <Picker.Item label="Website" value="Website" />
                      <Picker.Item label="Software" value="Software" />
                      <Picker.Item label="Bot" value="Bot" />
                      <Picker.Item label="Game" value="Bot" />
                      <Picker.Item label="Other" value="Other" />
                      <Picker.Item label="Create new..." value="new" />
                    </Picker>

                  </View>
                  <Text style={styles.labelTitle}>
                    Pictures
                  </Text>

                  {this.state.previews.length > 0 ?
                    <ScrollView horizontal={true}>
                      <View style={{ marginTop: 10, flex: 1, flexDirection: 'row' }}>
                        {this.state.previews.map((l, i) => (
                          <Image style={styles.preview} source={{ uri: this.state.previews[i] }} />
                        ))}
                      </View>
                    </ScrollView>
                    : null
                  }
                  <TouchableOpacity
                    style={styles.newPicture}
                    onPress={() => this.handleSelectImage()}>
                    <Text style={styles.shareButtonText}>Add new picture</Text>
                  </TouchableOpacity>
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


              {
                false && <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 10
                  }}>
                  <TextInput
                    style={[styles.input, { flex: 10 }]}
                    autoCorrect={false}
                    autoCapitalize='sentences'
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
              }

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
    alignSelf: 'center',
    margin: 5,
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
    marginBottom: 40,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  newPicture: {
    backgroundColor: '#1679D9',
    borderRadius: 4,
    height: 42,
    marginTop: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});
