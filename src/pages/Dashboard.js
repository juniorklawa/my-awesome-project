/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, Image, StyleSheet, Button, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActionButton from 'react-native-action-button';
import { Header } from 'react-native-elements';
import { iOSUIKit } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressCircle from 'react-native-progress-circle';
import { NavigationEvents } from 'react-navigation';

const height = Dimensions.get('window').height;

export default class Dashboard extends React.Component {
  state = {
    projects: [],
  };

  // static navigationOptions = {
  //   title: 'My ideas',
  //   headerStyle: {
  //     backgroundColor: '#7159c1',
  //   },
  //   headerTintColor: '#fff',
  //   headerTitleStyle: {
  //     fontWeight: 'bold',
  //   },
  // };

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    headerStyle: {
      backgroundColor: '#7159c1',
    },
    header: null,
  };

  async componentDidMount() {
    //await AsyncStorage.clear()
    this._retrieveData();
  }

  async _retrieveData() {
    console.log('_retrieveData')
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

    return (

      <SafeAreaView style={{ flex: 1, backgroundColor: '#ECEFF1' }}>
        <NavigationEvents
          onWillFocus={() => this._retrieveData()}
          onDidFocus={payload => console.log('did focus', payload)}
          onWillBlur={payload => console.log('will blur', payload)}
          onDidBlur={payload => console.log('did blur', payload)}
        />
        <Header
          placement="left"
          centerComponent={
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, { color: 'white', height:'100%' }]}>
              My ideas
            </Text>
          }
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content" // or directly
          containerStyle={{
            backgroundColor: '#7159c1',
            justifyContent: 'space-around',
          }}
        />

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
                            color: '#363a3f',
                            fontSize: 23,
                            marginTop:10,
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
                          <Icon name="edit" size={23} color="#666" solid />
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
                    <Text
                      style={[
                        iOSUIKit.bodyWhite,
                        { color: '#363a3f', fontSize: 15, marginTop: 10, width: '60%' },
                      ]}>
                      {project.shortDescription}
                    </Text>

                    <Text style={styles.tags}>{project.tags}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.category}>{project.category}</Text>
                    </View>
                    <View style={{ position: 'absolute', left: '75%', top: '35%' }}>
                      <ProgressCircle
                        percent={project.doneTasks / project.todo.length * 100}
                        radius={40}
                        borderWidth={5}
                        color="#7159c1"
                        shadowColor="#f0f0f0"
                        bgColor="#fff">
                        <Text style={[iOSUIKit.bodyEmphasized, { fontSize: 18, color: '#7159c1' }]}>{project.doneTasks > 0 ? `${(project.doneTasks / project.todo.length * 100).toFixed(0)}%` : `${0}%`}</Text>
                      </ProgressCircle>
                    </View>
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
                    style={{
                      width: '100%',
                      height: 180,
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
                        color: '#929699',
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
          buttonColor="#7159c1"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#ECEFF1',
    minHeight: '100%',
    //height: height,
  },
  category: {
    fontWeight: 'bold',
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
    color: '#7159c1',
    fontWeight: 'bold',
    width: '60%',
  },

  movieButtonText: {
    fontSize: 16,
    color: '#E8B708',
    fontWeight: 'bold',
  },
});
