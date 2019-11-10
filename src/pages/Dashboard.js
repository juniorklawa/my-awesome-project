/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, Image, StyleSheet, Button, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';
import { iOSUIKit } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import ProgressCircle from 'react-native-progress-circle';
import { NavigationEvents } from 'react-navigation';
import AwesomeAlert from 'react-native-awesome-alerts';
const height = Dimensions.get('window').height;

export default class Dashboard extends React.Component {
  state = {
    projects: [],
    displayProjects: [],
    showAlert: false,
    hideIcon: 'eye',
    filterProjects: false
  };


  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    this.showAlert()
    await this._retrieveData();
    this.hideAlert()
  }

  filterProjects() {
    this.setState({
      filterProjects: !this.state.filterProjects
    })

    if (this.state.filterProjects) {
      this.setState({
        hideIcon: 'eye'
      })
      this.state.projects = this.state.projects.filter((project) => !project.isArchived)
    } else {
      this.setState({
        hideIcon: 'eye-off'
      })
      this.state.projects = this.state.projects.filter((project) => project.isArchived)
    }
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
    const data = await AsyncStorage.getItem('projectss');
    const projects = (await JSON.parse(data)) || [];
    await this.setState({
      projects: projects,
    });

  }

  async deleteProject(id) {
    const newProjects = this.state.projects.filter(obj => obj.key != id);
    this.setState({
      projects: newProjects,
    });

    await AsyncStorage.setItem(
      'projectss',
      JSON.stringify(this.state.projects),
    );
  }

  async goToProjectDetails(id) {
    this.props.navigation.navigate('Details', { projectId: id, otherParam: id });
  }

  async goToEdit(id) {
    this.props.navigation.navigate('Edit', { projectId: id });
  }

  render() {
    StatusBar.setBarStyle('light-content', true);
    const { showAlert } = this.state;
    return (
      <LinearGradient style={{ flex: 1 }} colors={['#1679D9', '#0E56B9', '#0D4DB0']}>
        <StatusBar backgroundColor="#1679D9" barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationEvents
            onWillFocus={() => this._retrieveData()}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, { color: 'white', marginLeft: 18, marginTop: 32 }]}>
              My ideas
            </Text>
            {<TouchableOpacity style={{ marginHorizontal: 30, marginTop: 25 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10, }} onPress={() => this.filterProjects()}>
              <Icon name={this.state.hideIcon} size={28} color="#fff" solid />
            </TouchableOpacity>}
          </View>

          <ScrollView>
            <View style={styles.container}>
              {this.state.projects.length > 0 ? (
                this.state.projects.map((project, i) => (
                  <TouchableWithoutFeedback
                    key={i}
                    onPress={() => this.goToProjectDetails(project.key)}>
                    <View style={styles.projectContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={[
                            iOSUIKit.largeTitleEmphasizedObject,
                            {
                              color: '#4b4b4b',
                              fontSize: 23,
                              marginTop: 10,
                              padding: 0,
                              width: '80%',
                              lineHeight: 24
                            },
                          ]}>
                          {project.title}
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.goToEdit(project.key)}>
                          <View>
                            <IconEntypo name="edit" size={23} color="#666" solid />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={[
                          iOSUIKit.subheadEmphasized,
                          { color: '#929699', fontSize: 14, marginTop: 3 },
                        ]}>
                        {project.date}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.category}>{project.category}</Text>
                      </View>
                      <Text
                        style={[
                          iOSUIKit.bodyWhite,
                          { color: '#5b5b5b', fontSize: 15, marginTop: 10, width: '60%', fontWeight: '600' },
                        ]}>
                        {project.shortDescription}
                      </Text>
                      <Text style={styles.tags}>{project.tags}</Text>
                      {
                        project.todo.length > 0 ?
                          <View style={{ position: 'absolute', left: '75%', top: '35%' }}>
                            <ProgressCircle
                              percent={(project.doneTasks / project.todo.length * 100)}
                              radius={40}
                              borderWidth={5}
                              color="#1679D9"
                              shadowColor="#f0f0f0"
                              bgColor="#fff">
                              <Text style={[iOSUIKit.bodyEmphasized, { fontSize: 22, color: '#1679D9' }]}>{project.doneTasks > 0 ? `${(project.doneTasks / project.todo.length * 100).toFixed(0)}%` : `${0}%`}</Text>
                            </ProgressCircle>
                          </View> : null}
                    </View>
                  </TouchableWithoutFeedback>
                ))
              ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: height,
                    }}>
                    <Image
                      resizeMode='contain'
                      style={{
                        width: '100%',
                        height: 280,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginBottom: 16,
                        marginTop: 16,
                      }}
                      source={require('../icons/astronaut.png')}
                    />
                    <Text
                      style={[
                        iOSUIKit.subheadEmphasized,
                        {
                          color: 'white',
                          fontSize: 18,
                          marginTop: 20,
                          margin: 20,
                          alignContent: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                        },
                      ]}>
                      Press the + button to create your new awesome idea!
                </Text>
                  </View>
                )}
            </View>
          </ScrollView>


          <ActionButton
            onPress={() => {
              this.props.navigation.navigate('Add');
            }}
            style={{ marginBottom: 15 }}
            buttonColor="#f44336"
          />


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
      </LinearGradient>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    //backgroundColor: '#ECEFF1',
    minHeight: '100%',
    //height: height,
  },
  category: {
    fontWeight: 'bold',
    color: '#949494'
  },
  projectContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    margin: 5,
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
    color: '#1679D9',
    fontWeight: 'bold',
    width: '60%',
    marginTop: 10
  },

  movieButtonText: {
    fontSize: 16,
    color: '#E8B708',
    fontWeight: 'bold',
  },
});
