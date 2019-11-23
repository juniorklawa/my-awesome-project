import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';
import { iOSUIKit } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';


const height = Dimensions.get('window').height;
import ProjectCard from '../components/ProjectCard'
import Placeholder from '../components/Placeholder'

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
    this.state.displayProjects = this.state.projects.filter((project) => !project.isArchived)
    this.forceUpdate()
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
      const data = await AsyncStorage.getItem('projectss');
      const projects = (await JSON.parse(data)) || [];
      const filteredProjects = projects.filter((project) => !project.isArchived)
      await this.setState({
        projects: projects,
        displayProjects: filteredProjects
      });
    } catch (e) {
      console.log(e)
    }
    this.hideAlert()
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
    const { showAlert, displayProjects } = this.state;

    return (
      <LinearGradient style={{ flex: 1 }} colors={['#1679D9', '#0E56B9', '#0D4DB0']}>
        <StatusBar backgroundColor="#1679D9" barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationEvents
            onWillFocus={() => this._retrieveData()}
          />

          <View style={styles.header}>
            <Text
              style={[iOSUIKit.largeTitleEmphasizedObject, styles.headerTitle]}>
              {this.state.filterProjects ? 'Archived' : 'My ideas'}
            </Text>
            {
              <TouchableOpacity style={styles.filter} hitSlop={styles.filterHitSlop}
                onPress={() => this.filterProjects()}>
                <Icon name={this.state.hideIcon} size={28} color="#fff" solid />
              </TouchableOpacity>
            }
          </View>

          <ScrollView>
            <View style={styles.container}>

              {
                showAlert ?
                  <Placeholder /> : null
              }


              {
                displayProjects.map((project, i) =>
                  (
                    <ProjectCard navigation={this.props.navigation} key={i} project={project} />
                  )
                )
              }
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

      </LinearGradient>

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
    color: 'white',
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
  img: {
    width: '100%',
    height: 280,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
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
  }
});
