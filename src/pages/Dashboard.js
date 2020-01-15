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
  Modal,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { AdMobRewarded } from 'react-native-admob'
import { NavigationEvents } from 'react-navigation';

const height = Dimensions.get('window').height;
import ProjectCard from '../components/ProjectCard'
import Placeholder from '../components/Placeholder'
import { themes } from '../components/themesProvider'
import ThemeButton from '../components/ThemeButton';
import Banner from '../components/Banner';
import moment from 'moment';


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

  async rewarded() {
    this.setState({ showLoadingAlert: true })
    //dev
    const adUnitId = "ca-app-pub-3940256099942544/5224354917"
   
    try {
      await AdMobRewarded.setAdUnitID(adUnitId);
      await AdMobRewarded.requestAd().then(() => AdMobRewarded.showAd());
      this.setState({ showLoadingAlert: false })
    } catch (e) { this.setState({ showLoadingAlert: false }) }
  }


  async themeChange(key, isPro) {
    const { proVersion } = this.state
    if (isPro && !proVersion) {

      Alert.alert(
        'Ops!',
        'Feature avaible on PRO Version!',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      return
    }

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

    const themeKeyData = await AsyncStorage.getItem('themeKey');
    const key = (await JSON.parse(themeKeyData)) || null
    const proTimeLimit = await AsyncStorage.getItem('proTimeLimit');
    const timeLimit = (await JSON.parse(proTimeLimit)) || null
    const d1 = moment();
    const d2 = timeLimit
    const diff = moment(d2).diff(d1, 'seconds')

    if (!timeLimit || diff <= 0) {
      this.setState({ proVersion: false })
    } else {
      this.setState({
        proVersion: true,
        proEndTime: timeLimit
      })
    }
    if (key) {
      this.setState({ themeKey: key })
    } else {
      this.setState({ themeKey: 1 })
    }

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

    AdMobRewarded.addEventListener('videoCompleted', async () => {
      this.setState({ proVersion: true })
      this.setState({ proTimeLimit: moment().add({ day: 1 }) })

      this.state.proEndTime = this.state.proTimeLimit
      this.forceUpdate()
      try {
        await AsyncStorage.setItem(
          'proTimeLimit',
          JSON.stringify(this.state.proTimeLimit),
        );
      } catch (e) {
        console.error(e)
      }

    }
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
      const projects = (await JSON.parse(data)) || [];
      const filteredProjects = projects.filter((project) => !project.isArchived)
      await this.setState({
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
    } catch (e) { }

  }

  render() {
    StatusBar.setBarStyle('light-content', true);
    const { showAlert, displayProjects, shouldReload, filterProjects, themeKey } = this.state;

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
                            <View style={styles.emptyContainer}>

                              <Text
                                style={{ fontFamily: 'Roboto-Medium', fontSize: 60, color: '#fff' }}>
                                ¯\_(ツ)_/¯
                             </Text>

                              <Text
                                style={{ fontFamily: 'Roboto-Regular', fontSize: 16, color: '#fff', marginTop: 16 }}>
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
                textStyle={{ fontFamily: 'Roboto-Medium' }}
                buttonColor='#455A64'
                title='Settings'
                onPress={() => this.setState({ modal: true })}>
                <Icon size={25} name="settings" color={'#fff'} />
              </ActionButton.Item>

              <ActionButton.Item
                textStyle={{ fontFamily: 'Roboto-Medium' }}
                buttonColor='#B00D17'
                title='Delete all data'
                onPress={() => this.deleteAll()}>
                <Icon size={25} name="delete" color={'#fff'} />
              </ActionButton.Item>

              <ActionButton.Item
                textStyle={{ fontFamily: 'Roboto-Medium' }}
                buttonColor='#4DB00D'
                title="New Project"
                onPress={() => this.props.navigation.navigate('Add', { themeKey: themeKey })}>
                <Icon name="file-document" size={25} color={'#fff'} />
              </ActionButton.Item>
            </ActionButton>
          </View>
          <View>
            <Banner isPro={this.state.proVersion} />
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
              <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 32, color: '#fff' }}>
                Settings
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({ modal: false })}
                style={{ marginRight: 20 }}>
                <Icon name="close" color="#fff" size={32} />
              </TouchableOpacity>
            </Animatable.View>
            <ScrollView>
              <Animatable.View animation="fadeInUp"
                duration={800}
                style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 5, marginTop: 20, marginBottom: 20 }}>
                {!this.state.proVersion ?
                  <View>
                    <View style={{ margin: 20 }}>
                      <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 24, color: '#4b4b4b' }}>Unlock PRO Version</Text>
                      <Text style={{ fontFamily: 'Roboto-Medium' }}>Watch a video to Unlock new themes, and disable Advertisements for 1 day! </Text>
                    </View>

                    {!this.state.showLoadingAlert ?
                      <TouchableOpacity style={{ backgroundColor: '#eb2f06', marginHorizontal: 20, marginBottom: 20, height: 50, borderRadius: 5, alignItems: 'center', flexDirection: 'row' }} onPress={() => this.rewarded()}>

                        <Icon style={{ marginLeft: 10 }} name='play' color='#fff' size={32} />
                        <Text style={{ color: '#fff', fontFamily: 'Roboto-Bold', fontSize: 14 }}>
                          Watch a video
                        </Text>

                      </TouchableOpacity> :
                      <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                        <ActivityIndicator size="large" color="#eb2f06" />
                      </View>}
                  </View> :
                  <View style={{ margin: 20 }}>
                    <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 24, color: '#f6b93b' }}>PRO Version Unlocked</Text>
                    <Text style={{ fontFamily: 'Roboto-Medium' }}>PRO themes unlocked and Advertisements disabled until {moment(this.state.proEndTime).format('DD/MM/YYYY hh:mm A')} </Text>
                  </View>
                }
              </Animatable.View>

              <Animatable.View animation="fadeInUp" duration={800} style={{ backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 5, marginTop: 20, marginBottom: 20 }}>
                <View style={{ margin: 20 }}>
                  <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 24, color: '#4b4b4b' }}>Theme</Text>
                </View>

                <TouchableOpacity onPress={() => this.themeChange(1, false)}>
                  <ThemeButton color={'#0D4DB0'} title={'Default'} isPro={false} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.themeChange(2, true)}>
                  <ThemeButton color={'#011627'} title={'Midnight Blue'} isPro={true} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.themeChange(3, false)} >
                  <ThemeButton color={'#5f27cd'} title={'Nasu Purple'} isPro={false} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.themeChange(4, false)}>
                  <ThemeButton color={'#6ab04c'} title={'Pure Apple'} isPro={false} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.themeChange(5, true)}>
                  <ThemeButton color={'#000'} title={'Black'} isPro={true} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.themeChange(6, true)}>
                  <ThemeButton color={'#ff7979'} title={'Pink Glamour'} isPro={true} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.themeChange(7, true)}>
                  <ThemeButton color={'#f9ca24'} title={'Turbo'} isPro={true} />
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
    justifyContent: 'space-between'
  },
  headerTitle: {
    color: '#FFF',
    fontFamily: 'Roboto-Black',
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
    fontFamily: 'Roboto-Thin',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
});
