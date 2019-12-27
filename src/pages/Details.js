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
  Image,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { CheckBox } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';
import { Overlay, ListItem } from 'react-native-elements';
import UUIDGenerator from 'react-native-uuid-generator';
import AwesomeAlert from 'react-native-awesome-alerts';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';
import { Badge } from 'react-native-elements'
import { Backdrop } from "react-native-backdrop";
import { showMessage, hideMessage } from "react-native-flash-message";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import * as Progress from 'react-native-progress';
import { themes, theme } from '../components/themesProvider'
import moment from 'moment';
import Banner from '../components/Banner';

export default class Details extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    projects: [],
    project: {},
    todo: [],
    isArchived: false,
    todoItem: '',
    checked: false,
    doneTasks: 0,
    isVisible: false,
    showAlert: false,
    images: [],
    sections: [],
    visibleModal: false,
    backdrop: false,
    newSection: false,
    imgViewerUri: '',
    sectionModal: false,
    selectedSection: null,
    todoSection: [],
    todoSectionItem: '',
    sectionTitle: '',
    themeKey: null,
    proVersion: null
  };

  async componentDidMount() {
    const key = this.props.navigation.getParam('themeKey', 'NO-THEME-KEY')
    this.setState({ themeKey: key })

    const isPro = await AsyncStorage.getItem('proStartedTime')

    if (isPro) {
      this.setState({ proVersion: true })
    } else {
      this.setState({ proVersion: false })
    }

    this.showAlert()
    const projectId = this.props.navigation.getParam('projectId', 'NO-ID');
    const data = await AsyncStorage.getItem('keyProjects');
    const projects = (await JSON.parse(data)) || [];

    await this.setState({
      projects: projects,
    });
    const detail = await this.state.projects.find(obj => obj.key === projectId);
    const todoDetail = await detail.todo;
    this.setState({
      project: detail,
      todo: todoDetail,
    });
    this.state.images = detail.images
    this.forceUpdate()
    this.hideAlert()
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };


  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };


  calculateProgress() {

    const project = this.state.project

    const sectionTasks = project.sections.map((section) => section.tasks)
    const todoTasks = project.todo
    let tasksSpread = []
    sectionTasks.forEach(section => {
      tasksSpread.push(...section)
    });
    const sectionChecked = tasksSpread.filter((task) => task.checked)
    const todoChecked = project.todo.filter((task) => task.checked)
    const percentage = (sectionChecked.length + todoChecked.length) / (tasksSpread.length + todoTasks.length)
    return (percentage * 100) || 0
  }

  archiveProject() {
    const message = this.state.project.isArchived ?
      `You are going to unarchive ${this.state.project.title}`
      :
      `You are going to archive ${this.state.project.title}`

    Alert.alert(
      'Are you sure?',
      message,
      [
        {
          text: 'Yes', onPress: () => {

            this.setState({
              isArchived: true,
            });

            this.state.project.isArchived = !this.state.project.isArchived
            this.save()
            this.props.navigation.navigate('Dashboard', { isFirst: true });
          }
        },
        { text: 'No', onPress: () => { return } },
      ],
      { cancelable: true },
    );
  }

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
        this.state.images.push(response.path);
        if (this.state.images.length === 1) {
          showMessage({
            message: "Long press on image to delete it",
            type: "default",
          });
        }
        this.save()
        this.forceUpdate()
      }
    });
  }

  async save() {
    await AsyncStorage.setItem(
      'keyProjects',
      JSON.stringify(this.state.projects),
    );
  }

  handleSectionSubmit = async () => {
    if (this.state.sectionTitle === '') {
      this.bounce()
      showMessage({
        message: 'Title is obligatory',
        type: "warning",
      });
      return
    }
    this.state.project.sections.push({
      title: this.state.sectionTitle,
      tasks: this.state.todoSection,
      key: await UUIDGenerator.getRandomUUID()
    })
    this.setState({
      todoSection: [],
      sectionTitle: ''
    })
    this.setState({ newSection: false })
    this.save()
  }


  switchLabel(priority) {

    switch (priority) {
      case 'High':
        return (
          <Badge status="error" />
        )
      case 'Medium':
        return (
          <Badge status="warning" />
        )

      case 'Low':
        return (
          <Badge status="success" />
        )

      default:
        return (
          null
        )
    }

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

            AsyncStorage.setItem('keyProjects', JSON.stringify(newProjects));

            this.props.navigation.navigate('Dashboard', { isFirst: true });
          }
        },
        { text: 'No', onPress: () => { return } },
      ],
      { cancelable: true },
    );
  }

  deleteTodo(i) {
    const newTodoList = this.state.todo.filter((task, index) => index !== i)
    const isCheck = this.state.todo.find((task, index) => index === i)
    this.setState({
      todo: newTodoList
    })
    if (isCheck.checked) {
      this.state.project.doneTasks--
    }
    this.state.project.todo = this.state.todo
    this.save()
  }

  deleteSectionTodo(i) {
    const newTodoList = this.state.selectedSection.tasks.filter((task, index) => index !== i)
    this.state.selectedSection.tasks = newTodoList
    this.forceUpdate()
    this.save()
  }

  deleteNewSectionTodo(i) {
    const newTodoList = this.state.todoSection.filter((task, index) => index !== i)
    this.state.todoSection = newTodoList
    this.forceUpdate()
  }

  deleteImage(i) {
    try {
      this.state.project.images = this.state.project.images.filter((imagePath, index) => index !== i)
      this.forceUpdate()
      this.save()

    } catch (e) { }
  }

  goToDashBoard() {
    this.props.navigation.navigate('Dashboard', { isFirst: true });
  }

  generateTags(tags) {
    console.log(tags)
    //return ["Teste", "Android"]
    return tags.split(/,| /).filter((word) => word !== "")
  }

  addSectionTodo = async () => {

    if (this.state.todoSectionItem === '') {
      this.bounce()
      showMessage({
        message: 'Task description is obligatory',
        type: "warning",
      });
      return
    }

    this.state.selectedSection.tasks.push({
      task: this.state.todoSectionItem,
      checked: false,
    });

    this.setState({
      todoSectionItem: '',
    });
    AsyncStorage.setItem('keyProjects', JSON.stringify(this.state.projects));
  };

  addNewSectionTodo = async () => {

    if (this.state.todoSectionItem === '') {
      this.bounce()
      showMessage({
        message: 'Task description is obligatory',
        type: "warning",
      });
      return
    }

    this.state.todoSection.push({
      task: this.state.todoSectionItem,
      checked: false,
    });

    this.setState({
      todoSectionItem: '',
    });
    this.save()
  };

  deleteSection(clickedSection) {
    Alert.alert(
      'Are you sure?',
      `You are going to delete ${clickedSection.title}`,
      [
        {
          text: 'Yes', onPress: () => {
            const newSectionList = this.state.project.sections.filter((section) => section.key !== clickedSection.key)
            this.state.project.sections = newSectionList
            this.forceUpdate()
            this.save()
          }
        },
        { text: 'No', onPress: () => { return } },
      ],
      { cancelable: true },
    );
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

    if (this.state.todo.length === 1) {
      showMessage({
        message: "Long press on item to delete it",
        type: "default",
      });
    }

    this.setState({
      todoItem: '',
    });
    this.setState({
      isVisible: false
    })
    this.save()
  };



  render() {
    StatusBar.setBarStyle('light-content', true);
    const { showAlert, themeKey } = this.state;
    const {
      key,
      title,
      shortDescription,
      priority,
      tags,
      category,
      worktime,
      date,
      images,
    } = this.state.project;


    return (
      themeKey &&
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={themes[themeKey].backgroundColor} barStyle="light-content" />
        <LinearGradient style={{ flex: 1 }} colors={[themes[themeKey].backgroundColor, themes[themeKey].backgroundColor, themes[themeKey].backgroundColor]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
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
                  style={[{ color: '#4b4b4b', fontSize: 24, marginLeft: 10, fontFamily: 'Gilroy-Extrabold' }]}>
                  New Todo
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
                    placeholder="Add new todo"
                    onSubmitEditing={() => this.addTodo()}
                    placeholderTextColor="#999"
                    value={this.state.todoItem}
                    onChangeText={todoItem => this.setState({ todoItem })}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.shareButton, { backgroundColor: themes[themeKey].backgroundColor }]}
                  onPress={() => this.addTodo()}>
                  <Text style={styles.shareButtonText}>Add</Text>
                </TouchableOpacity>

              </Overlay>
              <View >
                <View style={{ height: 60, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <TouchableOpacity style={{ marginStart: 0 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10, }} onPress={() => this.goToDashBoard()}>
                    <Icon name="chevron-left" size={45} color="#fff" solid />
                  </TouchableOpacity>
                </View>

                {
                  showAlert ?
                    <View style={{ justifyContent: 'space-between' }}>
                      <ShimmerPlaceHolder style={{ marginHorizontal: 18, height: 25, width: 250, borderRadius: 5 }} autoRun={true} />
                      <ShimmerPlaceHolder style={{ marginHorizontal: 18, height: 15, width: 230, borderRadius: 5, marginTop: 5, marginBottom: 20 }} autoRun={true} />
                    </View>
                    :
                    <Animatable.View animation="fadeIn" duration={700}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                          style={[{ color: 'white', fontSize: 32, paddingHorizontal: 18, fontFamily: 'Gilroy-Extrabold', flex: 3 }]}>
                          {this.state.project.title}
                        </Text>
                        <TouchableOpacity
                          style={{ justifyContent: 'center' }}
                          onPress={() => this.deleteProject(key)}>
                          <Icon style={{ marginRight: 25 }} name="delete" size={28} color="#fff" solid />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', paddingHorizontal: 18, }}>
                        <Icon name="calendar" size={15} color={"#fff"} style={{ marginRight: 5 }} />
                        <Text
                          style={[

                            { color: '#eeeeee', fontSize: 14, marginBottom: 20, fontFamily: 'Gilroy-Regular' },
                          ]}>
                          Created at {moment(date).format('ddd, D[th] MMMM/YYYY')}
                        </Text>
                      </View>
                    </Animatable.View>
                }
              </View>
              <ScrollView>



                <View key={key} style={styles.container}>
                  {showAlert
                    ?
                    <View style={{ marginHorizontal: 20, borderRadius: 5, marginTop: 20 }}>
                      <ShimmerPlaceHolder style={[styles.placeHolder, { height: 300 }]} autoRun={true} />
                      <ShimmerPlaceHolder style={[styles.placeHolder, { height: 200 }]} autoRun={true} />
                      <ShimmerPlaceHolder style={styles.placeHolder} autoRun={true} />
                    </View>
                    :
                    <Animatable.View animation="fadeInLeft" duration={350} style={styles.cardContainer}>
                      <View style={{ margin: 20 }}>
                        <Text
                          style={styles.divTitle}>
                          Description
                  </Text>
                        <Text
                          style={[
                            { color: '#959595', fontSize: 16, marginTop: 5, fontFamily: 'Gilroy-Regular' },
                          ]}>
                          {shortDescription}
                        </Text>
                        {tags != '' ? <View>
                          <Text
                            style={styles.divTitle}>
                            Tags
                    </Text>

                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginRight: 10 }}>
                            {tags && this.generateTags(tags).map((label,i) => (<Badge
                              key={i}
                              containerStyle={{ margin: 1 }}
                              value={label}
                              badgeStyle={{
                                padding: 5,
                                backgroundColor: themes[themeKey].accentColor,
                                borderWidth: 0,
                              }}
                              textStyle={{ fontFamily: 'Gilroy-Medium' }}
                            />))}
                          </View>

                        </View> : null}
                        <Text
                          style={styles.divTitle}>
                          Category
                  </Text>
                        <Text style={[{ color: '#9E9E9E', fontSize: 16, marginTop: 5, fontFamily: 'Gilroy-Medium' },]}>{category}</Text>
                        {this.state.project.estimatedTime != '' ?
                          <View>
                            <Text
                              style={styles.divTitle}>
                              Estimate
                     </Text>

                            <Text
                              style={[{ color: '#9E9E9E', fontSize: 16, marginTop: 5, fontFamily: 'Gilroy-Regular' },]}>
                              {worktime}
                            </Text>
                          </View> : null}


                        {this.state.project.priority != 'None' ?
                          <View>
                            <Text
                              style={[{ color: '#4b4b4b', fontSize: 16, marginTop: 8, fontFamily: 'Gilroy-Bold' }]}>
                              Priority
                     </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              {
                                this.switchLabel(priority)
                              }
                              <Text
                                style={[styles.category, { marginLeft: 5, fontFamily: 'Gilroy-Medium', color: themes[themeKey].accentColor }]}>
                                {priority}
                              </Text>
                            </View>
                          </View> : null}

                      </View>


                    </Animatable.View>}

                  {

                    images ?
                      <Animatable.View animation="fadeInRight" duration={500} style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 5, marginTop: 20 }}>
                        <View style={{ margin: 20 }}>
                          <Text
                            style={styles.divTitle}>
                            Pictures
                    </Text>
                          <ScrollView horizontal={true}>
                            <View style={{ marginTop: 10, flex: 1, flexDirection: 'row' }}>
                              {images.map((path, i) => (
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
                                <Icon name="image" size={35} color={themes[themeKey].accentColor} />
                                <Text style={{ color: themes[themeKey].accentColor, fontSize: 12, fontFamily: 'Gilroy-Bold', margin: 8, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>Add new picture</Text>
                              </TouchableOpacity>


                            </View>
                          </ScrollView>
                        </View>
                      </Animatable.View>
                      : null
                  }


                  <View style={{ flex: 1 }}>
                    <Animatable.View animation="fadeInUp" duration={800} style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 5, marginTop: 20, marginBottom: 20 }}>

                      <View style={{ margin: 20 }}>
                        <Text style={styles.divTitle}>To-do</Text>
                        {this.state.todo.length === 0 && <Text style={{ fontFamily: 'Gilroy-Regular', color: '#9e9e9e' }}>Your todo list is empty...</Text>}

                        {this.state.todo && this.state.todo.map((task, i) => (
                          <CheckBox
                            key={i}
                            fontFamily={'Gilroy-Medium'}
                            style={{ width: '100%' }}
                            title={task.task}
                            containerStyle={{ margin: 5, padding: 10, marginLeft: 0, borderColor: 'transparent', width: '100%', }}
                            checked={task.checked}
                            onLongPress={() => {
                              this.deleteTodo(i)
                            }}
                            onPress={async () => {
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
                                'keyProjects',
                                JSON.stringify(this.state.projects),
                              );
                            }}
                          />
                        ))}


                        <TouchableOpacity
                          onPress={() => { this.setState({ backdrop: true }) }}
                          style={{
                            marginTop: 10,
                            borderRadius: 4,
                            padding: 8,
                            marginHorizontal: 0,
                            backgroundColor: themes[themeKey].accentColor,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Gilroy-Medium', color: '#fff', fontSize: 16 }}>
                              Add new to-do
                              </Text>
                            <View style={{ marginLeft: 8, height: 35, width: 35, justifyContent: 'center', alignItems: 'center' }}>
                              <Icon name="check-bold" size={23} color="#fff" />
                            </View>
                          </View>
                        </TouchableOpacity>

                      </View>
                      {this.state.todo && this.state.todo.length > 0 &&
                        <View style={{ marginBottom: 0 }}>
                          <Progress.Bar
                            progress={this.state.project.todo.length > 0 ? this.state.project.todo.filter(({ checked }) => checked === true).length / this.state.project.todo.length : 0}
                            color={'#27ae60'}
                            animated
                            borderWidth={0}
                            borderRadius={5}
                            unfilledColor={'#ecf0f1'}
                            width={null} />
                        </View>}
                    </Animatable.View>

                  </View>

                  {this.state.project.sections ?
                    <View style={{ flex: 1, marginTop: 10 }}>
                      <Animatable.View animation="fadeInUp" duration={800} style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 5, marginTop: 5, marginBottom: 20 }}>
                        <View style={{ margin: 20 }}>
                          <Text style={styles.divTitle}>Sections</Text>

                          {this.state.project.sections.length === 0 && <Text style={{ fontFamily: 'Gilroy-Regular', color: '#9e9e9e' }}>Your section list is empty...</Text>}

                          {this.state.project.sections.map((section, i) => (
                            <TouchableOpacity
                              onLongPress={() => this.deleteSection(section)}
                              onPress={() => {
                                this.setState({ selectedSection: section })
                                this.setState({ sectionModal: true })
                              }}
                              key={i}
                              style={{ marginTop: 10, backgroundColor: '#F5F5F5', borderRadius: 5, justifyContent: 'space-between', height: 60 }}>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                                <Text style={{ marginLeft: 15, fontFamily: 'Gilroy-Bold', fontSize: 18, color: '#616161' }}>{section.title}</Text>
                                <Text style={{ marginRight: 15, fontFamily: 'Gilroy-Medium', fontSize: 20, color: '#616161' }}>{`${section.tasks.filter(({ checked }) => checked === true).length}/${section.tasks.length} tasks`}</Text>
                              </View>
                              <View style={{ justifyContent: 'flex-end', marginTop: 0, width: '100%' }}>
                                <Progress.Bar
                                  progress={section.tasks.length > 0 ? section.tasks.filter(({ checked }) => checked === true).length / section.tasks.length : 0}
                                  color={'#27ae60'}
                                  animated
                                  borderWidth={0}
                                  borderRadius={5}
                                  unfilledColor={'#ecf0f1'}
                                  width={null} />
                              </View>
                            </TouchableOpacity>
                          ))}


                          <TouchableOpacity
                            onPress={() => { this.setState({ newSection: true }) }}
                            style={{
                              marginTop: 10,
                              borderRadius: 4,
                              padding: 8,
                              marginHorizontal: 0,
                              backgroundColor: themes[themeKey].accentColor,
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                              <Text style={{ fontFamily: 'Gilroy-Medium', color: '#fff', fontSize: 16 }}>
                                Add new section
                              </Text>
                              <View style={{ marginLeft: 8, height: 35, width: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name="ballot" size={23} color="#fff" />
                              </View>
                            </View>
                          </TouchableOpacity>

                        </View>
                      </Animatable.View>

                    </View> : null}



                  <View style={{ height: 80 }} />
                </View>
              </ScrollView>

              <ActionButton
                buttonColor={themes[themeKey].actionButtonColor}
              >

                <ActionButton.Item buttonColor='#fbc531' textStyle={{ fontFamily: 'Gilroy-Semibold' }} title={this.state.project.isArchived ? 'Unarchive project' : 'Archive project'} onPress={() => this.archiveProject(key)}>
                  <Icon name="archive" style={styles.actionButtonIcon} />
                </ActionButton.Item>

                <ActionButton.Item buttonColor='#7f8fa6' textStyle={{ fontFamily: 'Gilroy-Semibold' }} title="Edit info" onPress={() => this.props.navigation.navigate('Edit', { projectId: key, themeKey: themeKey })}>
                  <Icon name="circle-edit-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
              </ActionButton>
            </View>
            <View>
              <Banner isPro={this.state.proVersion} />
            </View>

          </SafeAreaView>

        </LinearGradient>


        <AwesomeAlert
          showProgress={true}
          progressSize={50}
          contentContainerStyle={{ height: 100, width: 200, alignItems: 'center', justifyContent: 'center' }}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          confirmButtonColor="#DD6B55"
        />

        <Modal
          onRequestClose={() => this.setState({ visibleModal: false })}
          visible={this.state.visibleModal}
          transparent={true}>
          <ImageViewer
            renderIndicator={() => null}
            menus={() => () => null}
            imageUrls={[{ url: `file://${this.state.imgViewerUri}` }]} />
        </Modal>

        <Backdrop
          visible={this.state.newSection}
          onClose={() => { this.setState({ newSection: false }) }}
          swipeConfig={{
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80,
          }}
          animationConfig={{
            speed: 14,
            bounciness: 4,
          }}
          overlayColor="rgba(0,0,0,0.32)"
          backdropStyle={{
            backgroundColor: '#fff',
          }}>

          <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={[styles.card]}>
              <Text style={[styles.fieldTitle]}>
                Section Title
                  </Text>
              <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize="sentences"
                placeholderTextColor="#999"
                value={this.state.sectionTitle}
                placeholder="Ex: Version 1.0, Design, Test..."
                onChangeText={sectionTitle =>
                  this.setState({ sectionTitle })
                }
              />
              <Text style={[styles.fieldTitle, { marginTop: 16 }]}>
                Section To-do
                  </Text>
              <View>
                {this.state.todoSection && this.state.todoSection.map((l, i) => (
                  <ListItem
                    containerStyle={styles.todoContainer}
                    key={i}
                    title={l.task}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => this.deleteNewSectionTodo(i)}
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
                    placeholder="Add new section todo"
                    onSubmitEditing={() => this.addNewSectionTodo()}
                    placeholderTextColor="#999"
                    value={this.state.todoSectionItem}
                    onChangeText={todoSectionItem => this.setState({ todoSectionItem })}
                  />
                  <TouchableOpacity
                    onPress={() => this.addNewSectionTodo()}
                    hitSlop={styles.hitSlop}
                    style={styles.todoBtn}>
                    <Icon name="chevron-right" size={35} color={themes[themeKey].accentColor} solid />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: themes[themeKey].backgroundColor, width: '100%' }]}
              onPress={() => this.handleSectionSubmit()}>
              <Text style={[styles.shareButtonText]}>Create new section</Text>
            </TouchableOpacity>

          </View>
        </Backdrop>

        <Backdrop
          visible={this.state.backdrop}
          onClose={() => { this.setState({ backdrop: false }) }}
          swipeConfig={{
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80,
          }}
          animationConfig={{
            speed: 14,
            bounciness: 4,
          }}
          overlayColor="rgba(0,0,0,0.32)"
          backdropStyle={{
            backgroundColor: '#fff',
          }}>

          <View style={{ width: '100%' }}>

            <Text style={[styles.divTitle]}>
              New to-do
              </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',

              }}>
              <TextInput
                style={[styles.input, { flex: 10 }]}
                autoCorrect={false}
                placeholder="Add new todo"
                onSubmitEditing={() => {
                  this.addTodo()
                  this.setState({ backdrop: false })
                }}
                placeholderTextColor="#999"
                value={this.state.todoItem}
                onChangeText={todoItem => this.setState({ todoItem })}
              />
            </View>

            <TouchableOpacity
              style={[styles.shareButton, { margin: 0, marginBottom: 10, backgroundColor: themes[themeKey].backgroundColor }]}
              onPress={() => {
                this.addTodo()
                this.setState({ backdrop: false })
              }}>
              <Text style={styles.shareButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

        </Backdrop>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.sectionModal}
          onRequestClose={() => {
            this.setState({ sectionModal: false })
          }}>
          <LinearGradient style={{ flex: 1 }} colors={[themes[themeKey].backgroundColor, themes[themeKey].backgroundColor, themes[themeKey].backgroundColor]}>
            <Animatable.View animation="fadeInLeft" style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 30 }}>

              {this.state.selectedSection && <Text
                style={[{ color: 'white', fontSize: 32, paddingHorizontal: 18, fontFamily: 'Gilroy-Extrabold', }]}>
                {this.state.selectedSection.title}
              </Text>}

              <TouchableOpacity
                onPress={() => this.setState({ sectionModal: false })}
                style={{ marginRight: 20 }}>
                <Icon name="close" color="#fff" size={32} />
              </TouchableOpacity>
            </Animatable.View>
            <ScrollView>
              <Animatable.View animation="fadeInUp" duration={800} style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 10, marginTop: 20, marginBottom: 20 }}>
                <View style={{ margin: 20 }}>
                  <Text style={styles.divTitle}>Tasks</Text>
                  {this.state.selectedSection && this.state.selectedSection.tasks.length === 0 && <Text style={{ fontFamily: 'Gilroy-Regular', color: '#9e9e9e' }}>Your task list is empty...</Text>}
                  {this.state.selectedSection !== null && this.state.selectedSection.tasks.map((task, i) => (
                    <View key={i}>
                      <CheckBox
                        key={i}
                        fontFamily={'Gilroy-Medium'}
                        style={{ width: '100%' }}
                        title={task.task}
                        containerStyle={{ margin: 5, padding: 10, marginLeft: 0, borderColor: 'transparent', width: '100%', }}
                        checked={task.checked}
                        onLongPress={() => this.deleteSectionTodo(i)}
                        onPress={async () => {
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
                            'keyProjects',
                            JSON.stringify(this.state.projects),
                          );
                        }}
                      />

                    </View>))}
                </View>
              </Animatable.View>
            </ScrollView>
            <View style={{ backgroundColor: themes[themeKey].backgroundColor, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: "#eee",
                  borderRadius: 4,
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  style={[styles.input, { flex: 10, marginTop: 0 }]}
                  autoCorrect={false}
                  autoCapitalize='sentences'
                  placeholder="Add new task"
                  onSubmitEditing={() => this.addSectionTodo()}
                  placeholderTextColor="#999"
                  value={this.state.todoSectionItem}
                  onChangeText={todoSectionItem => this.setState({ todoSectionItem })}
                />
                <TouchableOpacity
                  onPress={() => this.addSectionTodo()}
                  hitSlop={styles.hitSlop}
                  style={styles.todoBtn}>
                  <Icon name="chevron-right" size={35} color={themes[themeKey].accentColor} solid />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  category: {
    fontFamily: 'Gilroy-Bold',
  },
  projectContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 20
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    width: '100%'
  },
  fieldTitle: {
    color: '#4b4b4b',
    fontSize: 24,
    fontFamily: 'Gilroy-Bold'
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
    fontWeight: 'bold',
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: '#FFF',
  },
  todoContainer: {
    //marginRight: 50,
    backgroundColor: '#ECEFF1',
    borderRadius: 4, marginTop: 2,
    marginBottom: 2
  },
  preview: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    margin: 5,
    borderRadius: 4,
  },
  divTitle: {
    color: '#3F3E51',
    fontSize: 22,
    marginTop: 8,
    fontFamily: 'Gilroy-Bold'
  },
  shareButton: {
    borderRadius: 4,
    height: 42,
    marginTop: 15,
    marginBottom: 40,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderRadius: 4,
    backgroundColor: "#F7F7F7",
    padding: 15,
    marginTop: 10,
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
  },
  placeHolder: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 5,
    width: '98%',
    height: 150
  },
  tags: {
    fontFamily: 'Gilroy-Bold'
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
