import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressCircle from 'react-native-progress-circle';
import { Badge } from 'react-native-elements'
import moment from 'moment';
import { themes } from '../components/themesProvider'

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
  calculateProgress(project) {

    const sectionTasks = project.sections.map((section) => section.tasks)
    const todoTasks = project.todo
    let tasksSpread = []
    sectionTasks.forEach(section => {
      tasksSpread.push(...section)
    });
    const sectionChecked = tasksSpread.filter((task) => task.checked)
    const todoChecked = project.todo.filter((task) => task.checked)
    const percentage = (sectionChecked.length + todoChecked.length) / (tasksSpread.length + todoTasks.length)
    return (percentage * 100) || 0
  }


  async goToProjectDetails(id) {
    this.props.navigation.navigate('Details', { projectId: id, themeKey: this.props.themeKey });
  }

  async goToEdit(id) {
    this.props.navigation.navigate('Edit', { projectId: id });
  }

  render() {
    const { project, themeKey } = this.props
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
            <Icon name="calendar" size={15} color={themes[themeKey].accentColor} style={{ marginRight: 5 }} />
            <Text
              style={[
                iOSUIKit.subheadEmphasized,
                styles.projectDate,
              ]}>
              {`${moment(project.date).format('ddd, D[th] MMMM/YYYY')}`}
            </Text>
          </View>
          <View>
            <Text style={styles.projectCategory}>{project.category}</Text>
          </View>
          {
            project.tags ? <Text style={[styles.projectTags, { color: themes[themeKey].accentColor }]}>{project.tags}</Text> : null
          }

          {
            project.todo.length > 0 || project.sections ?
              <View style={{ position: 'absolute', left: '75%', top: '35%' }}>
                <ProgressCircle
                  percent={this.calculateProgress(project)}
                  radius={40}
                  borderWidth={6}
                  color={this.calculateProgress(project) === 100 ? "#059B79" : themes[themeKey].accentColor}
                  shadowColor="#f0f0f0"
                  bgColor="#fff">
                  {this.calculateProgress(project) === 100 ?
                    <Icon name="check" size={35} color={"#059B79"} style={styles.actionButtonIcon} />
                    :
                    <Text style={[{ fontSize: 22, color: themes[themeKey].accentColor, fontFamily: 'Gilroy-Bold' }]}>
                      {
                        `${this.calculateProgress(project).toFixed(0)}%`
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
    color: '#8c7ae6',
    fontFamily: 'Gilroy-Bold',
    width: '60%',
    marginTop: 10
  },
});
