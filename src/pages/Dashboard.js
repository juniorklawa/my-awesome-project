import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { NavigationEvents } from 'react-navigation';

const height = Dimensions.get('window').height;
import ProjectCard from '../components/ProjectCard'
import Placeholder from '../components/Placeholder'
import { themes, theme } from '../components/themesProvider'


export default class Dashboard extends React.Component {
  state = {
    projects: [],
    displayProjects: [],
    showAlert: false,
    hideIcon: 'eye',
    filterProjects: false,
    shouldReload: false,
    themeKey: 1,
    modal: false
  };

  handleViewRef = ref => this.view = ref;

  fadeInUp = () => this.view.fadeInUp(500)

  static navigationOptions = {
    header: null,
  };


  async themeChange(key){
    await AsyncStorage.setItem(
      'themeKey',
      JSON.stringify(key),
    );
    this.setState({themeKey:key})
  }



  async componentDidMount() {

    const themeKeyData = await AsyncStorage.getItem('themeKey');
    const key = (await JSON.parse(themeKeyData)) || null
    this.setState({ themeKey: key })

    this.showAlert()
    try {
      await this._retrieveData();
      this.state.displayProjects = this.state.projects.filter((project) => !project.isArchived)
      this.forceUpdate()
    } catch (e) {
      console.error(e)
    }
    this.hideAlert()
    this.fadeInUp()
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
            this.setState({ displayProjects: [] })
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
      const themeKeyData = await AsyncStorage.getItem('themeKey');
      const key = (await JSON.parse(themeKeyData)) || null
      const projects = (await JSON.parse(data)) || [];
      const filteredProjects = projects.filter((project) => !project.isArchived)
      await this.setState({
        projects: projects,
        displayProjects: filteredProjects,
      });


      console.log('KEY: ', this.state.themeKey)

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
      console.log(e)
    }

  }

  render() {
    StatusBar.setBarStyle('light-content', true);
    const { showAlert, displayProjects, shouldReload, filterProjects, themeKey } = this.state;

    return (
      <LinearGradient style={{ flex: 1 }} colors={[themes[themeKey].backgroundColor, themes[themeKey].backgroundColor, themes[themeKey].backgroundColor]}>
        <StatusBar backgroundColor={themes[themeKey].backgroundColor} barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationEvents
            onWillFocus={() => {
              const param = this.props.navigation.getParam('isFirst');
              this.setState({ shouldReload: param })
              this._retrieveData()
              if (param) {
                this.setState({ hideIcon: 'eye' })
                this.setState({ filterProjects: false })
                this.showAlert()
                this.hideAlert()
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
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                            <Text
                              style={{ fontFamily: 'Roboto-Medium', fontSize: 60, color: '#fff' }}>
                              ¯\_(ツ)_/¯
                        </Text>

                            <Text
                              style={{ fontFamily: 'Gilroy-Regular', fontSize: 16, color: '#fff', marginTop: 16 }}>
                              Your archived list is empty...
                        </Text>

                          </View> :
                          <View>
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
          </ScrollView>
          <ActionButton
            buttonColor={themes[themeKey].actionButtonColor}
          >

            <ActionButton.Item textStyle={{ fontFamily: 'Gilroy-Semibold' }} buttonColor='#455A64' title='Settings' onPress={() => this.setState({ modal: true })}>
              <Icon size={25} name="settings" color={'#fff'} />
            </ActionButton.Item>

            <ActionButton.Item textStyle={{ fontFamily: 'Gilroy-Semibold' }} buttonColor='#B00D17' title='Delete all data' onPress={() => this.deleteAll()}>
              <Icon size={25} name="delete" color={'#fff'} />
            </ActionButton.Item>

            <ActionButton.Item textStyle={{ fontFamily: 'Gilroy-Semibold' }} buttonColor='#4DB00D' title="New Project" onPress={() => this.props.navigation.navigate('Add', { themeKey: themeKey })}>
              <Icon name="file-document" size={25} color={'#fff'} />
            </ActionButton.Item>
          </ActionButton>
        </SafeAreaView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({ modal: false })
          }}>
          <LinearGradient style={{ flex: 1 }} colors={[themes[themeKey].backgroundColor, themes[themeKey].backgroundColor, themes[themeKey].backgroundColor]}>
            <Animatable.View animation="fadeInLeft" style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', margin: 20 }}>
              <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 32, color: '#fff' }}>
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
                  <Text style={{ fontFamily: 'Gilroy-Semibold', fontSize: 24, color: '#4b4b4b' }}>Theme</Text>
                </View>

                <TouchableOpacity 
                onPress={() => this.themeChange(1)}
                style={{ backgroundColor: '#0D4DB0', marginHorizontal: 20, marginBottom:20, height:45, borderRadius:5, justifyContent:'center' }}>
                  <Text style={{marginLeft:16, color:'#fff', fontFamily:'Gilroy-Bold', fontSize:16}}>
                    Default
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => this.themeChange(2)}
                style={{ backgroundColor: '#011627', marginHorizontal: 20, marginBottom:20, height:45, borderRadius:5, justifyContent:'center' }}>
                  <Text style={{marginLeft:16, color:'#fff', fontFamily:'Gilroy-Bold', fontSize:16}}>
                    Midnight
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => this.themeChange(3)}
                style={{ backgroundColor: '#5f27cd', marginHorizontal: 20, marginBottom:20, height:45, borderRadius:5, justifyContent:'center' }}>
                  <Text style={{marginLeft:16, color:'#fff', fontFamily:'Gilroy-Bold', fontSize:16}}>
                    Purple
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => this.themeChange(4)}
                style={{ backgroundColor: '#6ab04c', marginHorizontal: 20, marginBottom:20, height:45, borderRadius:5, justifyContent:'center' }}>
                  <Text style={{marginLeft:16, color:'#fff', fontFamily:'Gilroy-Bold', fontSize:16}}>
                    Green
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => this.themeChange(5)}
                style={{ backgroundColor: '#000', marginHorizontal: 20, marginBottom:20, height:45, borderRadius:5, justifyContent:'center' }}>
                  <Text style={{marginLeft:16, color:'#fff', fontFamily:'Gilroy-Bold', fontSize:16}}>
                    Black
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            </ScrollView>
            <View style={{ backgroundColor: themes[themeKey].backgroundColor, justifyContent: 'center', alignItems: 'center', padding: 10 }}>

            </View>
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
    justifyContent: 'space-between'
  },
  headerTitle: {
    color: '#FFF',
    fontFamily: 'Gilroy-Extrabold',
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
  alertStyle: {
    height: 100,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgOnboarding: {
    width: 300,
    height: 300,
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
    fontFamily: 'Roboto-Thin',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
});
