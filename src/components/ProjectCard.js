import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import IconEntypo from 'react-native-vector-icons/Entypo';
import ProgressCircle from 'react-native-progress-circle';


export default class ProjectCard extends Component {


  async goToProjectDetails(id) {
    this.props.navigation.navigate('Details', { projectId: id, otherParam: id });
  }

  async goToEdit(id) {
    this.props.navigation.navigate('Edit', { projectId: id });
  }

  render() {
    const { project } = this.props
    return (
      <TouchableWithoutFeedback
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
                styles.projectTitle
              ]}>
              {project.title}
            </Text>
          </View>
          <Text
            style={[
              iOSUIKit.subheadEmphasized,
              styles.projectDate,
            ]}>
            {project.date}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.projectCategory}>{project.category}</Text>
          </View>
          <Text
            style={[
              iOSUIKit.bodyWhite,
              styles.projectDescription,
            ]}>
            {project.shortDescription}
          </Text>
          <Text style={styles.projectTags}>{project.tags}</Text>
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
                  <Text style={[iOSUIKit.bodyEmphasized, { fontSize: 22, color: '#1679D9' }]}>
                    {
                      project.doneTasks > 0 ? `${(project.doneTasks / project.todo.length * 100).toFixed(0)}%` : `${0}%`
                    }
                  </Text>
                </ProgressCircle>
              </View> : null
          }
        </View>
      </TouchableWithoutFeedback>
    );
  }
}


const styles = StyleSheet.create({
  projectCategory: {
    fontWeight: 'bold',
    color: '#949494'
  },
  projectContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    margin: 5,
  },
  projectDescription: {
    color: '#5b5b5b',
    fontSize: 15,
    marginTop: 10,
    width: '60%',
    fontWeight: '600'
  },
  projectTitle: {
    color: '#4b4b4b',
    fontSize: 23,
    marginTop: 10,
    padding: 0,
    width: '80%',
    lineHeight: 24
  },
  projectDate: {
    color: '#929699',
    fontSize: 14,
    marginTop: 3
  },
  projectTags: {
    color: '#1679D9',
    fontWeight: 'bold',
    width: '60%',
    marginTop: 10
  },
});
