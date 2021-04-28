import 'react-native-gesture-handler';
import * as React from 'react';
import Login from './Components/Login';
import CourseUpdate from './Components/Courses/Course-Update';
import CoursesList from './Components/Courses/Courses-List';
import TopicUpdate from './Components/Topics/Topic-Update';
import TopicsList from './Components/Topics/Topics-List';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="CoursesList" component={CoursesList} />
        <Tab.Screen name="CourseUpdate" component={CourseUpdate} />
        <Tab.Screen name="TopicsList" component={TopicsList} />
        <Tab.Screen name="TopicUpdate" component={TopicUpdate} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;