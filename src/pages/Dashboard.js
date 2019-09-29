import React from 'react';
import {View, Text, Image, StyleSheet, Button, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActionButton from 'react-native-action-button';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {iOSUIKit} from 'react-native-typography';
import {SafeAreaView} from 'react-navigation';

export default class Dashboard extends React.Component {
  state = {
    projects: [],
  };

  async componentDidMount() {
    //await AsyncStorage.clear()
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
    //console.log(id);
    this.props.navigation.navigate('Details', {projectId: id, otherParam: id,});
  }

  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <SafeAreaView style={{backgroundColor: '#000', flex: 1}}>
        <View
          style={{
            padding: 12,
            height: 100,
            backgroundColor: '#000',
            justifyContent: 'flex-end',
          }}>
          <Text style={[iOSUIKit.largeTitleEmphasizedObject, {color: 'white'}]}>
            My ideas
          </Text>
        </View>
        <ScrollView>
          <View style={styles.container}>
            {this.state.projects.length > 0 ? (
              this.state.projects.map(project => (
                <TouchableOpacity
                  key={project.key}
                  onPress={() => this.goToProjectDetails(project.key)}>
                  <View style={styles.movieContainer}>
                    <Text
                      style={[
                        iOSUIKit.largeTitleEmphasizedObject,
                        {
                          color: '#363a3f',
                          fontSize: 23,
                          marginTop: -5,
                          padding: 0,
                        },
                      ]}>
                      {project.title}
                    </Text>
                    <Text
                      style={[
                        iOSUIKit.subheadEmphasized,
                        {color: '#929699', fontSize: 14, marginTop: -10},
                      ]}>
                      {project.date}
                    </Text>
                    <Text
                      style={[
                        iOSUIKit.bodyWhite,
                        {color: '#363a3f', fontSize: 15, marginTop: 10},
                      ]}>
                      {project.shortDescription}
                    </Text>

                    <Text style={styles.tags}>{project.tags}</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.category}>{project.category}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={[
                    iOSUIKit.subheadEmphasized,
                    {
                      color: '#929699',
                      fontSize: 20,
                      marginTop: 20,
                      padding: 0,
                      alignContent: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    },
                  ]}>
                  Press the + button to create your new awesome idea!
                </Text>
                <Image
                  style={{
                    width: '100%',
                    height: 180,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginBottom: 16,
                    marginTop: 16,
                  }}
                  source={require('../icons/astronaut.png')}></Image>
              </View>
            )}
          </View>
        </ScrollView>

        <ActionButton
          onPress={() => {
            this.props.navigation.navigate('Add');
          }}
          style={{marginBottom: 5}}
          buttonColor="#7159c1"></ActionButton>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ECEFF1',
    minHeight: '100%',
    height: 500,
  },
  category: {
    fontWeight: 'bold',
  },
  movieContainer: {
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
  },

  movieButtonText: {
    fontSize: 16,
    color: '#E8B708',
    fontWeight: 'bold',
  },
});
