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
import { iOSUIKit } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';
import { Overlay } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import ConfettiCannon from 'react-native-confetti-cannon';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Badge } from 'react-native-elements'

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
    showMeConfetti: false,
    images: [],
    visibleModal: false,
    imgViewerUri: ''
  };

  async componentDidMount() {
    this.showAlert()
    const projectId = this.props.navigation.getParam('projectId', 'NO-ID');
    const data = await AsyncStorage.getItem('projectss');
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

  archiveProject(id) {
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


            AsyncStorage.setItem('projectss', JSON.stringify(this.state.projects));

            this.props.navigation.navigate('Dashboard');
          }
        },
        { text: 'No', onPress: () => { return } },
      ],
      { cancelable: true },
    );
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
    const isCheck = this.state.todo.find((task, index) => index === i)
    this.setState({
      todo: newTodoList
    })

    if (isCheck.checked) {
      this.state.project.doneTasks--
    }

    this.state.project.todo = this.state.todo

    AsyncStorage.setItem('projectss', JSON.stringify(this.state.projects));
  }

  deleteImage(i) {
    try {
      this.state.project.images = this.state.project.images.filter((imagePath, index) => index !== i)
      this.forceUpdate()
      AsyncStorage.setItem('projectss', JSON.stringify(this.state.projects));

    } catch (e) {
      console.log(e)
    }
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
    this.setState({
      isVisible: false
    })
    AsyncStorage.setItem('projectss', JSON.stringify(this.state.projects));
  };



  render() {
    //console.log(this.state.project)
    StatusBar.setBarStyle('light-content', true);
    const { showAlert } = this.state;
    const {
      key,
      title,
      shortDescription,
      priority,
      tags,
      category,
      worktime,
      date,
      images
    } = this.state.project;


    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#1679D9" barStyle="light-content" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>

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
              style={styles.shareButton}
              onPress={() => this.addTodo()}>
              <Text style={styles.shareButtonText}>Add</Text>
            </TouchableOpacity>

          </Overlay>
          <LinearGradient colors={['#1679D9', '#0E56B9']}>
            <View style={{ height: 60, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity style={{ marginStart: 0 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10, }} onPress={() => this.goToDashBoard()}>
                <Icon name="chevron-left" size={45} color="#fff" solid />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={[iOSUIKit.largeTitleEmphasizedObject, { color: 'white', fontSize: 32, paddingHorizontal: 18 }]}>
                {this.state.project.title}
              </Text>
              <TouchableOpacity
                onPress={() => this.deleteProject(key)}>
                <Icon style={{ marginRight: 25, marginTop: 10 }} name="delete" size={28} color="#fff" solid />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                iOSUIKit.subheadEmphasized,
                { color: '#eeeeee', fontSize: 14, marginBottom: 20, paddingHorizontal: 18 },
              ]}>
              Created at {date}
            </Text>
          </LinearGradient>
          <ScrollView >



            <View key={key} style={styles.container}>

              <View style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 10, marginTop: 20 }}>
                <View style={{ margin: 20 }}>
                  <Text
                    style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 24 }]}>
                    Description
              </Text>
                  <Text
                    style={[
                      iOSUIKit.subhead,
                      { color: '#4b4b4b', fontSize: 16, marginTop: 5 },
                    ]}>
                    {shortDescription}
                  </Text>
                  {tags != '' ? <View>
                    <Text
                      style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 22, marginTop: 8 }]}>
                      Tags
              </Text>
                    <Text style={styles.tags}>{tags}</Text>
                  </View> : null}
                  <Text
                    style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 22, marginTop: 8 }]}>
                    Category
              </Text>
                  <Text style={styles.category}>{category}</Text>
                  {this.state.project.estimatedTime != '' ?
                    <View>
                      <Text
                        style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 22, marginTop: 8 }]}>
                        Estimate
                     </Text>

                      <Text
                        style={styles.category}>
                        {worktime}
                      </Text>
                    </View> : null}


                  {this.state.project.priority != 'None' ?
                    <View>
                      <Text
                        style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 16, marginTop: 8 }]}>
                        Priority
                     </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {
                          this.switchLabel(priority)
                        }
                        <Text
                          style={styles.category}>
                          {priority}
                        </Text>
                      </View>
                    </View> : null}

                </View>


              </View>

              {

                images && images.length > 0 ?
                  <View style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 10, marginTop: 20 }}>
                    <View style={{ margin: 20 }}>
                      <Text
                        style={[iOSUIKit.largeTitleEmphasizedObject, { color: '#4b4b4b', fontSize: 22 }]}>
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
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                  : null
              }

              {this.state.todo.length > 0 ? <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 10, marginTop: 20 }}>
                  <View style={{ margin: 20 }}>
                    <Text style={[styles.category, { fontSize: 25, color: '#4b4b4b' }]}>To-do</Text>
                    {this.state.todo.map((task, i) => (
                      <CheckBox
                        key={i}
                        style={{ width: '100%' }}
                        title={task.task}
                        containerStyle={{ margin: 5, padding: 10, marginLeft: 0, borderColor: 'transparent', width: '100%' }}
                        checked={task.checked}
                        onLongPress={() => this.deleteTodo(i)}
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
                            'projectss',
                            JSON.stringify(this.state.projects),
                          );

                          if (this.state.project.doneTasks === this.state.project.todo.length) {
                            this.setState({ showMeConfetti: true })

                            await setTimeout(() => {
                              this.setState({
                                showMeConfetti: false
                              });
                            }, 4000);
                          }


                        }}
                      />
                    ))}
                  </View>
                </View>
              </View> : null}
            </View>
          </ScrollView>

          <ActionButton
            style={{ marginBottom: 15 }}
            buttonColor="#0E56B9"
          >

            <ActionButton.Item buttonColor='#00897B' title={this.state.project.isArchived ? 'Unarchive project' : 'Archive project'} onPress={() => this.archiveProject(key)}>
              <Icon name="archive" style={styles.actionButtonIcon} />
            </ActionButton.Item>

            <ActionButton.Item buttonColor='#3498db' title="Edit project" onPress={() => this.props.navigation.navigate('Edit', { projectId: key })}>
              <Icon name="circle-edit-outline" style={styles.actionButtonIcon} />
            </ActionButton.Item>

            <ActionButton.Item buttonColor='#1abc9c' title="New to-do" onPress={() => this.setState({
              isVisible: true
            })}>
              <Icon name="check" style={styles.actionButtonIcon} />
            </ActionButton.Item>

          </ActionButton>

        </SafeAreaView>
        <AwesomeAlert
          show={showAlert}
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
        {
          this.state.showMeConfetti ?
            <ConfettiCannon fadeOut={true} count={50} origin={{ x: -10, y: -100 }} />
            : null
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  category: {
    fontWeight: 'bold',
    color: '#1679D9',
    marginLeft:5
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
  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
  preview: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    margin: 5,
    borderRadius: 4,
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
  input: {
    borderRadius: 4,
    backgroundColor: "#F7F7F7",
    padding: 15,
    marginTop: 10,
    fontSize: 16,
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
    color: '#1679D9',
    fontWeight: 'bold',
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
