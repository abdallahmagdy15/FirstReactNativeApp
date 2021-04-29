import 'react-native-gesture-handler';
import React from 'react';
import Login from './Components/Login';
import CourseUpdate from './Components/Courses/Course-Update';
import CoursesList from './Components/Courses/Courses-List';
import TopicUpdate from './Components/Topics/Topic-Update';
import TopicsList from './Components/Topics/Topics-List';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Header } from 'react-native-elements';
import { Alert, Button, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

function App() {
  const [isAuthenticated, setAuthentication] = React.useState(false);

  AsyncStorage.getItem("username").then((uname) => {
    console.log(uname);
    if (uname == null)
      setAuthentication(false);
    else
      setAuthentication(true);
  })

  return (
    <NavigationContainer>
      {<Header
        backgroundColor="#264653"
        centerComponent={{ text: 'Ramadan Kareem 🌙 ', style: { color: '#fff', fontWeight: "bold", fontSize: 18, lineHeight: 30 } }}
        rightComponent={
          isAuthenticated ?
            <Button onPress={logout.bind(this)} color="#264653" title="Logout" />
            : <></>
        }
        containerStyle={{
          justifyContent: 'space-around',
          paddingTop: 10
        }}
      />}
      <Tab.Navigator>
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen options={{ title: "Courses List" }} name="CoursesList" component={CoursesList} />
        <Tab.Screen options={{ title: "Update Course" }} name="CourseUpdate" component={CourseUpdate} />
        <Tab.Screen options={{ title: "Topics List" }} name="TopicsList" component={TopicsList} />
        <Tab.Screen options={{ title: "Update Topic" }} name="TopicUpdate" component={TopicUpdate} />
      </Tab.Navigator>
    </NavigationContainer>
  );

}
const logout = async () => {
  AsyncStorage.clear().then(() => {
    Alert.alert('Loged Out !');
  });
}

export default App;