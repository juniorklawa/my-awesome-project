import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";
import { ListItem, Overlay } from 'react-native-elements';
import { Picker } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import UUIDGenerator from 'react-native-uuid-generator';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable'
import moment from 'moment';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  TouchableHighlight,
  TextInput,
  Image,
  StatusBar,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class New extends Component {

  handleViewRefText = reference => this.ref = reference;
  handleViewRef = ref => this.view = ref;


  fadeInRight = () => {
    this.view.fadeInRight(500)
    this.ref.fadeInRight(500);
  };
  bounce = () => this.view.bounce(800);

  state = {
    title: '',
    shortDescription: '',
    priority: 'None',
    worktime: '',
    category: 'Application',
    tags: '',
    todoItem: '',
    date: moment().format('ddd, D[th] MMMM/YYYY'),
    todo: [],
    projects: [],
    estimatedTime: '',
    estimatedInterval: 'day(s)',
    doneTasks: 0,
    currentHeight: null,
    isVisible: false,
    visibleModal: false,
    imgViewerUri: '',
    previews: [],
    defaultCategory: true,
    finishModal: false,
    //onFocus
    project: {},
    titleLabel: false,
    descriptionLabel: false,
    tagsLabel: false,
    estimatedTimeLabel: false,
    categoryLabel: false,
    priorityLabel: false,
    projectId: null,
    step: 3,
    stepLength: 3

  };

  static navigationOptions = {
    header: null,
  };

  componentDidMount = async () => {
    const projectId = this.props.navigation.getParam('projectId', null);
    if (projectId !== null) {

      const data = await AsyncStorage.getItem('keyProjects');
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
        worktime: this.state.worktime,
        category: this.state.project.category,
        priority: this.state.project.priority,
        previews: this.state.project.images
      });
    } else {
      const data = await AsyncStorage.getItem('keyProjects');
      const projects = (await JSON.parse(data)) || [];
      await this.setState({
        projects: projects,
      });

    }

  };

  switchText(step) {
    switch (step) {
      case 0:
        return (
          <Animatable.View duration={500} animation='fadeInRight'>
            <Text
              style={styles.headerTitle}>
              About your idea...
         </Text>
          </Animatable.View>
        )
      case 1:
        return (
          <Text
            style={styles.headerTitle}>
            More details...
          </Text>
        )
      case 2:
        return (
          <Text
            style={styles.headerTitle}>
            Sketches, drawings etc...
          </Text>
        )
      case 3:
        return (
          <Text
            style={styles.headerTitle}>
            Your awesome To-do list...
            </Text>
        )
    }
  }

  switchStep(step) {
    const {
      title,
      shortDescription,
      category,
      tags,
      priority,
      worktime,
      estimatedTime,
      estimatedInterval,
      images,
      todo,
      isArchived,
      doneTasks,
      previews,
      defaultCategory
    } = this.state

    //this.switchText(step)

    switch (step) {

      case 0:
        return (
          <Animatable.View animation="fadeInRight" duration={500} style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View animation="fadeInRight" duration={500} style={styles.card} >

              <Text
                style={styles.fieldTitle}>
                Required information
            </Text>

              <Text style={[styles.labelTitle, { color: this.state.titleLabel === false ? '#4b4b4b' : '#1679D9' }]}>
                Project Name
            </Text>
              <TextInput
                style={styles.input}
                autoCorrect={false}
                onFocus={() => this.setState({ titleLabel: !this.props.titleLabel })}
                onBlur={() => this.setState({ titleLabel: !this.state.titleLabel })}
                autoCapitalize='words'
                placeholder="Ex: My Awesome Idea"
                placeholderTextColor="#999"
                value={title}
                onChangeText={title => this.setState({ title })}
              />

              <Text style={[styles.labelTitle, { color: this.state.descriptionLabel === false ? '#4b4b4b' : '#1679D9' }]}>
                Description
            </Text>
              <TextInput
                style={styles.input}
                editable
                multiline
                onFocus={() => this.setState({ descriptionLabel: !this.props.descriptionLabel })}
                onBlur={() => this.setState({ descriptionLabel: !this.state.descriptionLabel })}
                autoCorrect={false}
                autoCapitalize="sentences"
                placeholderTextColor="#999"
                value={shortDescription}
                placeholder="Ex: An app that tracks awesome ideas"
                onChangeText={shortDescription =>
                  this.setState({ shortDescription })
                }
              />
            </View>
          </Animatable.View>
        )
      case 1:
        return (

          <Animatable.View animation="fadeInRight" duration={500} style={styles.card} >
            <Text
              style={[styles.fieldTitle, { marginTop: 16 }]}>
              Additional information
            </Text>

            <Text style={[styles.labelTitle, { color: this.state.tagsLabel === false ? '#4b4b4b' : '#1679D9' }]}>
              Keywords
            </Text>

            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="words"
              onFocus={() => this.setState({ tagsLabel: !this.props.tagsLabel })}
              onBlur={() => this.setState({ tagsLabel: !this.state.tagsLabel })}
              placeholder="Ex: #Random #Pictures #Dogs"
              placeholderTextColor="#999"
              value={tags}
              onChangeText={tags => this.setState({ tags })}
            />

            <Text style={[styles.labelTitle, { color: this.state.estimatedTimeLabel === false ? '#4b4b4b' : '#1679D9' }]}>
              Estimated time
            </Text>

            <View style={styles.timeContainer}>
              <View>
                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  onFocus={() => this.setState({ estimatedTimeLabel: !this.props.estimatedTimeLabel })}
                  onBlur={() => this.setState({ estimatedTimeLabel: !this.state.estimatedTimeLabel })}
                  autoCapitalize="none"
                  placeholder="0"
                  keyboardType='numeric'
                  placeholderTextColor="#999"
                  value={estimatedTime}
                  onChangeText={estimatedTime => this.setState({ estimatedTime })}
                />
              </View>
              <View style={[styles.selectInput, styles.intervalInput]}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon color='#1679D9' name="chevron-down" />}
                  style={{ width: '100%', fontFamily: 'Gilroy-Medium' }}
                  value={estimatedInterval}
                  onChangeText={estimatedInterval => this.setState({ estimatedInterval })}
                  placeholder="Select one option"
                  selectedValue={estimatedInterval}
                  onValueChange={estimatedInterval => this.setState({ estimatedInterval })}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff">

                  <Picker.Item label="day(s)" value="day(s)" />
                  <Picker.Item label="week(s)" value="week(s)" />
                  <Picker.Item label="month(s)" value="month(s)" />
                  <Picker.Item label="year(s)" value="year(s)" />

                </Picker>
              </View>
            </View>

            <Text style={[styles.labelTitle, { color: this.state.categoryLabel === false ? '#4b4b4b' : '#1679D9' }]}>
              Category
            </Text>
            {
              defaultCategory ? <View style={styles.selectInput}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon color='#1679D9' name="chevron-down" />}
                  style={{ width: '100%' }}
                  value={category}
                  onChangeText={category => this.setState({ category })}
                  placeholder="Select one option"
                  onBlur={() => this.setState({ categoryLabel: !this.state.categoryLabel })}
                  selectedValue={category}
                  onValueChange={category => {
                    if (category === 'new') {
                      this.setState({ defaultCategory: false })
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
                  <Picker.Item label="Game" value="Game" />
                  <Picker.Item label="Other" value="Other" />
                  <Picker.Item label="Create new..." value="new" />
                </Picker>

              </View> :
                <View>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoFocus={true}
                    autoCapitalize="words"
                    placeholderTextColor="#999"
                    onChangeText={category => this.setState({ category })}
                  />
                </View>
            }

            <Text style={[styles.labelTitle, { color: this.state.categoryLabel === false ? '#4b4b4b' : '#1679D9' }]}>
              Priority
            </Text>
            <View style={styles.selectInput}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon color='#1679D9' name="chevron-down" />}
                style={{ width: '100%' }}
                value={this.state.priority}
                onChangeText={priority => this.setState({ priority })}
                placeholder="Select one option"
                selectedValue={this.state.priority}
                onValueChange={priority => this.setState({ priority })}
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
              >
                <Picker.Item label="None" value="None" />
                <Picker.Item label="High" value="High" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Low" value="Low" />
              </Picker>
            </View>
          </Animatable.View>
        )

      case 2:
        return (

          <View style={styles.card}>
            <Text
              style={styles.fieldTitle}>
              Pictures
            </Text>

            {previews ?
              <ScrollView horizontal={true}>
                <View style={styles.imgSlider}>
                  {previews.map((path, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        this.setState({
                          imgViewerUri: path,
                          visibleModal: true
                        })
                      }}
                      onLongPress={() => this.deleteImage(i)}>
                      <Image style={styles.preview} source={{ uri: `file://${path}` }} />
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.newPicture}
                    onPress={() => this.handleSelectImage()}>
                    <Icon name="image" size={35} color={"#1679D9"} style={styles.actionButtonIcon} />
                    <Text style={{ color: '#1679D9', fontSize: 12, fontFamily: 'Gilroy-Bold', margin: 8, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>Add new picture</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView> :
              null
            }

            <Modal
              onRequestClose={() => this.setState({ visibleModal: false })}
              visible={this.state.visibleModal}
              transparent={true}>
              <ImageViewer
                renderIndicator={() => null}
                menus={() => () => null}
                imageUrls={[{ url: `file://${this.state.imgViewerUri}` }]} />
            </Modal>



          </View>
        )
      case 3:
        return (
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.card}>
              {
                todo.length > 0 ?
                  <Text style={[styles.fieldTitle, { marginBottom: 8 }]}>
                    To-do
                </Text>

                  : <View>
                    <Text style={[styles.fieldTitle, { marginBottom: 8 }]}>
                      To-do
                </Text>
                    <Text style={{ color: '#666', marginLeft: 3, fontFamily: 'Gilroy-Regular' }}>
                      Simple, and general tasks
                  </Text>
                  </View>
              }


              <View style={{ marginTop: 0, flex: 1 }}>
                {this.state.todo.map((l, i) => (
                  <ListItem
                    containerStyle={styles.todoContainer}
                    key={i}
                    title={l.task}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => this.deleteTodo(i)}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <Icon name="delete" size={20} color="#666" solid />
                      </TouchableOpacity>
                    }
                  />
                ))}

                <View
                  style={{
                    marginTop: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: 0
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
                    hitSlop={styles.hitSlop}
                    style={styles.todoBtn}>
                    <Icon name="chevron-right" size={35} color="#1679D9" solid />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.card}>
              {
                todo.length > 0 ?
                  <Text style={[styles.fieldTitle, { marginBottom: 8 }]}>
                    Sections
                  </Text>

                  : <View>
                    <Text style={[styles.fieldTitle, { marginBottom: 8 }]}>
                      Sections
                </Text>
                    <Text style={{ color: '#666', marginLeft: 3, fontFamily: 'Gilroy-Regular' }}>
                      Groups of tasks, like a version, or a step of your project/idea
                  </Text>
                  </View>
              }
              <View
                style={{
                  marginTop: 30,
                  flexDirection: 'row',
                  borderRadius: 10,
                  alignItems: 'center',
                  backgroundColor: '#F7F7F7',
                  justifyContent: 'space-between',
                  padding: 10,
                  marginHorizontal: 0
                }}>
                <Text style={{ fontFamily: 'Gilroy-Medium', color: '#999', fontSize: 16, marginLeft: 10 }}>
                  Add new section
            </Text>
                <TouchableOpacity style={{ height: 50, width: 50, borderRadius: 50 / 2, backgroundColor: '#1679D9', justifyContent: 'center', alignItems: 'center' }}>
                  <Icon name="plus" size={23} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

        )

      default:
        return (
          null
        )
    }

  }


  deleteTodo(i) {
    const newTodoList = this.state.todo.filter((task, index) => index !== i)
    this.setState({
      todo: newTodoList
    })
  }

  deleteImage(i) {
    const newImages = this.state.previews.filter((imagePath, index) => index !== i)
    this.setState({
      previews: newImages
    })
  }

  addTodo = async () => {

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
        this.state.previews.push(response.path);
        if (this.state.previews.length === 1) {
          showMessage({
            message: "Long press on image to delete it",
            type: "default",
          });
        }
        this.forceUpdate()
      }
    });
  }

  handleSubmit = async () => {


    if ((!this.state.title || !this.state.shortDescription) && this.state.step === 0) {
      this.bounce()
      showMessage({
        message: 'Title and description are obligatory',
        type: "danger",
      });
      return
    }
    if (this.state.step < this.state.stepLength) {
      this.setState({
        step: this.state.step + 1
      })
      this.fadeInRight()

      return
    }

    const projectId = this.props.navigation.getParam('projectId', null);
    if (projectId !== null) {
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

    } else {

      await this.state.projects.unshift({
        title: this.state.title,
        shortDescription: this.state.shortDescription,
        category: this.state.category,
        tags: this.state.tags,
        priority: this.state.priority,
        worktime: this.state.estimatedTime + ' ' + this.state.estimatedInterval,
        estimatedTime: this.state.estimatedTime,
        estimatedInterval: this.state.estimatedInterval,
        images: this.state.previews,
        key: await UUIDGenerator.getRandomUUID(),
        date: this.state.date,
        todo: this.state.todo,
        isArchived: false,
        doneTasks: this.state.doneTasks,
      });

    }





    await AsyncStorage.setItem(
      'keyProjects',
      JSON.stringify(this.state.projects),
    );

    this.setState({ finishModal: true })
    setTimeout(() => {
      this.props.navigation.navigate('Dashboard', { isFirst: false });
    }, 800);

  };

  goToDashBoard() {
    this.props.navigation.navigate('Dashboard');
  }

  render() {
    StatusBar.setBarStyle('light-content', true);

    return (

      <LinearGradient style={{ flex: 1 }} colors={['#0D4DB0', '#0E56B9', '#1679D9']}>
        <StatusBar backgroundColor="#0D4DB0" barStyle="light-content" />
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
              style={styles.fieldTitle}>
              New Category
            </Text>
            <View
              style={styles.overlayContainer}>
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
              onPress={() => {
                this.setState({ isVisible: false })
              }}>
              <Text style={styles.shareButtonText}>Add</Text>
            </TouchableOpacity>
          </Overlay>

          <View style={{ flex: 1 }} >
            <View style={{ flex: 1 }}>

              <View style={styles.chevron}>
                <TouchableOpacity
                  style={{ marginStart: 0 }} hitSlop={styles.hitSlop}
                  onPress={() => this.goToDashBoard()}>
                  <Icon name="chevron-left" size={45} color="#fff" solid />
                </TouchableOpacity>
                {
                  this.state.step !== 0 && this.state.step < this.state.stepLength ? <TouchableOpacity
                    style={{ marginEnd: 32 }} hitSlop={styles.hitSlop}
                    onPress={() => this.setState({
                      step: this.state.step + 1
                    })}>
                    <Text style={{ fontFamily: 'Gilroy-Black', color: '#84A9DC' }}>
                      Skip
                  </Text>
                  </TouchableOpacity> : null
                }

              </View>
              <ScrollView>
                <TouchableOpacity onPress={this.fadeInRight}>
                  <Animatable.View ref={this.handleViewRefText}>
                    {this.switchText(this.state.step)}
                  </Animatable.View>
                </TouchableOpacity>

                <View style={styles.container}>

                  <Animatable.View ref={this.handleViewRef} style={{
                    justifyContent: 'center',
                    alignItems: 'center',

                    width: '100%'
                  }}>
                    {this.switchStep(this.state.step)}



                  </Animatable.View>
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => this.handleSubmit()}>
                    <Text style={styles.shareButtonText}>{this.state.step < this.state.stepLength ? 'Next step' : 'Create new project'}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.finishModal}>
              <View style={{ flex: 1, backgroundColor: '#0D4DB0', justifyContent: 'center', alignItems: 'center' }}>
                <LottieView style={{ height: 150, width: '50%' }} source={require('../icons/animation.json')} autoPlay />
                <Animatable.View duration={800} animation='fadeInUpBig'>
                  <Text style={{ fontFamily: 'Gilroy-Bold', color: '#fff', fontSize: 25 }} animation='fadeIn'>Project created!</Text>
                </Animatable.View>

              </View>
            </Modal>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  labelTitle: {
    color: '#1679D9',
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
    marginTop: 16
  },
  imgSlider: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row'
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
  intervalInput: {
    height: 57,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    //right: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    width: '100%'
  },
  todoBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    flex: 1, justifyContent: 'center',
    alignItems: 'center'
  },
  overlayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    paddingHorizontal: 18,
    marginBottom: 10,
    fontFamily: 'Gilroy-Black'
  },
  selectInput: {
    borderRadius: 4,
    backgroundColor: "#F7F7F7",
    padding: 5,
    flex: 1,
    marginTop: 10,
  },

  todoContainer: {
    //marginRight: 50,
    backgroundColor: '#ECEFF1',
    borderRadius: 4, marginTop: 2,
    marginBottom: 2
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },
  fieldTitle: {
    color: '#4b4b4b',
    fontSize: 24,
    fontFamily: 'Gilroy-Bold'
  },
  heroImg: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  preview: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    margin: 5,
    borderRadius: 4,
  },

  input: {
    borderRadius: 10,
    backgroundColor: "#F7F7F7",
    padding: 15,
    fontFamily: 'Gilroy-Medium',
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#56B90E',
    borderRadius: 8,
    height: 42,
    width: '100%',
    marginVertical: 10,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  newPicture: {
    borderColor: '#eee',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 4,
  },

  shareButtonText: {
    fontFamily: 'Gilroy-Black',
    fontSize: 16,
    borderRadius: 8,
    color: '#FFF',
  },
});
