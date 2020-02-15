import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents, SafeAreaView } from 'react-navigation';
import Placeholder from '../components/Placeholder';
import ProjectCard from '../components/ProjectCard';
import ThemeButton from '../components/ThemeButton';
import { themes } from '../providers/themesProvider'
import sort from 'fast-sort';

const height = Dimensions.get('window').height;


export default class Dashboard extends React.Component {
  state = {
    projects: [],
    displayProjects: [],
    showAlert: false,
    showLoadingAlert: false,
    hideIcon: 'eye',
    filterProjects: false,
    shouldReload: false,
    themeKey: 1,
    modal: false,
    proVersion: false,
    proTimeLimit: null,
    proEndTime: null
  };

  handleViewRef = ref => this.view = ref;
  fadeInUp = () => this.view.fadeInUp(500)

  static navigationOptions = {
    header: null,
  };

  async themeChange(key) {
    try {
      await AsyncStorage.setItem(
        'themeKey',
        JSON.stringify(key),
      );
      this.setState({ themeKey: key })

    } catch (e) {
      console.error(e)
    }

  }



  async componentDidMount() {
    this.showAlert()
    const themeKeyData = await AsyncStorage.getItem('themeKey');
    const key = (await JSON.parse(themeKeyData)) || null
    if (key) {
      this.setState({ themeKey: key })
    } else {
      this.setState({ themeKey: 1 })
    }
    try {
      await this._retrieveData();
      this.setState({
        projects: sort(this.state.projects).desc(project => project.updatedAt)
      })
      this.state.displayProjects = this.state.projects.filter((project) => !project.isArchived)
      this.forceUpdate()
    } catch (e) {
      console.error(e)
    }
    this.state.projects.map((project) => {
      if (!project.updatedAt) {
        project.updatedAt = project.date
      }
    })
    this.save();
    const arrayTeste = sort(this.state.projects).desc(project => project.updatedAt)
    console.log('projects: ', arrayTeste)
    this.hideAlert()
    this.fadeInUp()
  }

  async save() {
    const { projects } = this.state
    await AsyncStorage.setItem(
      'keyProjects',
      JSON.stringify(projects),
    );
  }

  filterProjects() {
    if (!this.state.filterProjects) {
      this.setState({ hideIcon: 'eye-off' })
      this.state.displayProjects = this.state.projects.filter((project) => project.isArchived)
    } else {
      this.setState({ hideIcon: 'eye' })
      this.state.displayProjects = this.state.projects.filter((project) => !project.isArchived)
    }
    this.setState({
      filterProjects: !this.state.filterProjects,
    })
  }

  deleteAll() {
    Alert.alert(
      'Are you sure?',
      `You are going to delete all data`,
      [
        {
          text: 'Yes', onPress: () => {
            AsyncStorage.clear()
            this.setState({ displayProjects: [], lastTime: null })
          }
        },
        { text: 'No', onPress: () => { return } },
      ],
      { cancelable: true },
    );
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

  async _retrieveData() {
    try {
      const data = await AsyncStorage.getItem('keyProjects');
      const projects = sort((await JSON.parse(data))).desc(project => project.updatedAt) || [];
      const filteredProjects = sort(projects.filter((project) => !project.isArchived)).desc(project => project.updatedAt)
      this.setState({
        projects: projects,
        displayProjects: filteredProjects,
      });
    } catch (e) {
      console.error(e)
    }
  }

  async deleteProject(id) {
    try {
      const newProjects = this.state.projects.filter(obj => obj.key != id);
      this.setState({
        projects: newProjects,
      });
      await AsyncStorage.setItem(
        'keyProjects',
        JSON.stringify(this.state.projects),
      );
    } catch (e) {
      console.error(e)
    }

  }

  render() {
    StatusBar.setBarStyle('light-content', true);
    const { showAlert, displayProjects, filterProjects, themeKey } = this.state;

    return (
      themeKey &&
      <LinearGradient style={{ flex: 1 }} colors={[themes[themeKey].backgroundColor, themes[themeKey].backgroundColor, themes[themeKey].backgroundColor]}>
        <StatusBar backgroundColor={themes[themeKey].backgroundColor} barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <NavigationEvents
              onWillFocus={() => {
                const param = this.props.navigation.getParam('isFirst');
                this.setState({ shouldReload: param })
                this._retrieveData()
                this.setState({
                  projects: sort(this.state.projects).desc(project => project.updatedAt)
                })
                if (param) {
                  this.setState({ hideIcon: 'eye' })
                  this.setState({ filterProjects: false })
                  // this.showAlert()
                  // this.hideAlert()
                  this.fadeInUp()
                }
              }}
            />
            <View style={styles.header}>
              <Text
                style={[styles.headerTitle]}>
                {filterProjects ? 'Archived' : 'My projects'}
              </Text>
              {
                <TouchableOpacity style={styles.filter} hitSlop={styles.filterHitSlop}
                  onPress={async () => {
                    this.filterProjects()
                    this.forceUpdate()
                  }}>
                  <Icon name={this.state.hideIcon} size={28} color="#fff" solid />
                </TouchableOpacity>
              }
            </View>

            <ScrollView>
              <View style={styles.container}>
                {
                  showAlert === true ?
                    <Placeholder /> :

                    <Animatable.View ref={this.handleViewRef}>

                      {displayProjects &&
                        displayProjects.length > 0 && showAlert === false ?
                        displayProjects.map((project, i) =>
                          (
                            <ProjectCard navigation={this.props.navigation} themeKey={themeKey} key={i} project={project} />
                          )
                        ) :
                        <View
                          style={styles.imgContainer}>
                          {this.state.filterProjects ?
                            <View style={styles.emptyContainer}>

                              <Text
                                style={{ fontFamily: 'Lato-Regular', fontSize: 60, color: '#fff' }}>
                                ¯\_(ツ)_/¯
                             </Text>

                              <Text
                                style={{ fontFamily: 'Lato-Regular', fontSize: 16, color: '#fff', marginTop: 16 }}>
                                Your archived list is empty...
                              </Text>

                            </View> :
                            <View style={styles.emptyContainer}>
                              <Image
                                style={styles.imgOnboarding}
                                source={require('../icons/therocket.png')}
                              />
                              <Text
                                style={[
                                  styles.onboardingText,
                                ]}>
                                Press the + button to launch your new awesome idea!
                              </Text>
                            </View>
                          }

                        </View>
                      }
                    </Animatable.View>
                }


              </View>
              <View style={{ height: 100 }} />
            </ScrollView>

            <ActionButton
              buttonColor={themes[themeKey].actionButtonColor}
            >

              <ActionButton.Item
                textStyle={{ fontFamily: 'Lato-Regular' }}
                buttonColor='#455A64'
                title='Settings'
                onPress={() => this.setState({ modal: true })}>
                <Icon size={25} name="settings" color={'#fff'} />
              </ActionButton.Item>

              <ActionButton.Item
                textStyle={{ fontFamily: 'Lato-Regular' }}
                buttonColor='#B00D17'
                title='Delete all data'
                onPress={() => this.deleteAll()}>
                <Icon size={25} name="delete" color={'#fff'} />
              </ActionButton.Item>

              <ActionButton.Item
                textStyle={{ fontFamily: 'Lato-Regular' }}
                buttonColor='#4DB00D'
                title="New Project"
                onPress={() => this.props.navigation.navigate('Add', { themeKey: themeKey })}>
                <Icon name="file-document" size={25} color={'#fff'} />
              </ActionButton.Item>
            </ActionButton>
          </View>
          <View>

          </View>
        </SafeAreaView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({ modal: false })
          }}>
          <LinearGradient style={{ flex: 1 }}
            colors={[themes[themeKey].backgroundColor, themes[themeKey].backgroundColor, themes[themeKey].backgroundColor]}>
            <Animatable.View
              animation="fadeInLeft"
              style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', margin: 20 }}>
              <Text style={{ fontFamily: 'Lato-Black', fontSize: 32, color: '#fff' }}>
                Settings
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({ modal: false })}
                style={{ marginRight: 20 }}>
                <Icon name="close" color="#fff" size={32} />
              </TouchableOpacity>
            </Animatable.View>
            <ScrollView>
              <Animatable.View animation="fadeInUp" duration={800} style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 5, marginTop: 20, marginBottom: 20 }}>
                <View style={{ margin: 20 }}>
                  <Text style={{ fontFamily: 'Lato-Black', fontSize: 24, color: '#4b4b4b' }}>Theme</Text>
                </View>

                <TouchableOpacity onPress={() => this.themeChange(1)}>
                  <ThemeButton color={'#0D4DB0'} title={'Default'} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.themeChange(2)}>
                  <ThemeButton color={'#011627'} title={'Midnight Blue'} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.themeChange(3)} >
                  <ThemeButton color={'#5f27cd'} title={'Nasu Purple'} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.themeChange(4)}>
                  <ThemeButton color={'#6ab04c'} title={'Pure Apple'} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.themeChange(5)}>
                  <ThemeButton color={'#000'} title={'Black'} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.themeChange(6)}>
                  <ThemeButton color={'#ff7979'} title={'Pink Glamour'} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.themeChange(7)}>
                  <ThemeButton color={'#f9ca24'} title={'Turbo'} />
                </TouchableOpacity>
              </Animatable.View>
            </ScrollView>

          </LinearGradient>
        </Modal>

      </LinearGradient >

    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  headerTitle: {
    color: '#FFF',
    fontFamily: 'Lato-Black',
    fontSize: 32,
    marginLeft: 18,
    marginTop: 32
  },
  filter: {
    marginHorizontal: 30,
    marginTop: 25
  },
  filterHitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertStyle: {
    height: 100,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgOnboarding: {
    height: '45%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
    resizeMode: 'contain',
    marginTop: 16,
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height,
  },
  imgText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    margin: 20,
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  placeHolder: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 5,
    width: '98%',
    height: 150
  },
  onboardingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    margin: 20,
    fontFamily: 'Lato-Thin',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
});
