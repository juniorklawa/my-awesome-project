import React from 'react';
import { View, Text, Image, StyleSheet, Button, StatusBar, Picker } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { iOSUIKit } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';

export default class Details extends React.Component {
  state = {
    projects: [],
    project: null,
    teste: ['0', '1', '2'],
  };

  async componentDidMount() {
    const projectId = this.props.navigation.getParam('projectId', 'NO-ID');
    const data = await AsyncStorage.getItem('projectss');
    const projects = (await JSON.parse(data)) || [];
    await this.setState({
      projects: projects,
    });

    const Detail = await this.state.projects.filter(
      obj => obj.key === projectId,
    );
    await this.setState({
      projects: Detail,
      project: projects[0],
    });

    console.table(projects[0]);
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

  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <SafeAreaView>
        {this.state.projects.map(project => (



          <View key={project.key} style={styles.movieContainer}>
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
                { color: '#929699', fontSize: 14, marginTop: -10 },
              ]}>
              Created at {project.date}
            </Text>
            <Text
              style={[
                iOSUIKit.bodyWhite,
                { color: '#363a3f', fontSize: 15, marginTop: 10 },
              ]}>
              Description: {project.shortDescription}
            </Text>

            <Text style={styles.tags}>Tags: {project.tags}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.category}>Category: {project.category}</Text>
            </View>

            <Text
              style={[
                iOSUIKit.bodyWhite,
                { color: '#363a3f', fontSize: 15 },
              ]}>
              Estimate to finish {project.worktime}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.category, { fontSize: 25 }]}>To-do</Text>
            </View>
            <View style={{ width: "100%", height: 100, borderRadius: 5, backgroundColor: '#7159c1' }}>

            </View>
            <View style={{ width: "100%", height: 100, borderRadius: 5, backgroundColor: '#7159c1', marginTop: 10 }}>
              <Text>
                2: FEATURES
                </Text>
            </View>
          </View>

        ))}
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
