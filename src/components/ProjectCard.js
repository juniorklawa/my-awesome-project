import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressCircle from 'react-native-progress-circle';
import { Badge } from 'react-native-elements'



export default class ProjectCard extends Component {

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
                
                styles.projectTitle
              ]}>
              {project.title}
            </Text>
            {
              this.switchLabel(project.priority)
            }

          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="calendar" size={15} color={"#1679D9"} style={{ marginRight: 5 }} />
            <Text
              style={[
                iOSUIKit.subheadEmphasized,
                styles.projectDate,
              ]}>
              {`${project.date}`}
            </Text>
          </View>
          <View>
            <Text style={styles.projectCategory}>{project.category}</Text>
          </View>
          {
            project.tags ? <Text style={styles.projectTags}>{project.tags}</Text> : null
          }

          {
            project.todo.length > 0 ?
              <View style={{ position: 'absolute', left: '75%', top: '35%' }}>
                <ProgressCircle
                  percent={(project.doneTasks / project.todo.length * 100)}
                  radius={40}
                  borderWidth={6}
                  color={project.doneTasks === project.todo.length ? "#059B79" : "#1679D9"}
                  shadowColor="#f0f0f0"
                  bgColor="#fff">
                  {project.doneTasks === project.todo.length ?
                    <Icon name="check" size={35} color={"#059B79"} style={styles.actionButtonIcon} />
                    :
                    <Text style={[{ fontSize: 22, color: '#1679D9', fontFamily: 'Gilroy-Bold' }]}>
                      {
                        project.doneTasks > 0 ? `${(project.doneTasks / project.todo.length * 100).toFixed(0)}%` : `${0}%`
                      }
                    </Text>
                  }
                </ProgressCircle>
              </View> : null
          }
        </View >
      </TouchableWithoutFeedback>
    );
  }
}


const styles = StyleSheet.create({
  projectCategory: {
    fontFamily: 'Gilroy-Semibold',
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
    color: '#3F3E51',
    fontSize: 23,
    marginTop: 10,
    padding: 0,
    fontFamily: 'Gilroy-Extrabold',
    width: '65%',
    lineHeight: 24
  },
  projectDate: {
    color: '#929699',
    fontSize: 14,
    fontFamily: 'Gilroy-Regular',
  },
  projectTags: {
    color: '#1679D9',
    fontFamily: 'Gilroy-Bold',
    width: '60%',
    marginTop: 10
  },
});
