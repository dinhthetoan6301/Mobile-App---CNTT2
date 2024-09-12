import React from 'react';
import 'react-native-url-polyfill/auto';
import { Colors } from '../src/components/styles';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../src/screens/Login';
import Signup from '../src/screens/Signup';
import Homepage from '../src/screens/Homepage';
import ApplicationStatusScreen from '../src/screens/ApplicationStatusScreen';
import ApplyJobScreen from '../src/screens/ApplyJobScreen';
import ManageCandidatesScreen from '../src/screens/ManageCandidatesScreen';
import EditProfileScreen from '../src/screens/EditProfileScreen';
import UserProfileScreen from '../src/screens/UserProfileScreen';
import CompanyProfileScreen from '../src/screens/CompanyProfileScreen';
import JobSearchScreen from '../src/screens/JobSearchScreen';
import PostJobScreen from '../src/screens/PostJobScreen';
import JobDetailsScreen from '../src/screens/JobDetailsScreen';
import RoleSelectionScreen from '../src/screens/RoleSelectionScreen';
import ManageCVsScreen from '../src/screens/ManageCVsScreen';
import ViewCVScreen from '../src/screens/ViewCVScreen'; // Đảm bảo import đúng

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: Colors.tertiary,
          headerTransparent: true,
          headerTitle: '',
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
        }}
        initialRouteName='Login'
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen 
          name="Homepage" 
          component={Homepage} 
          options={{
            headerShown: false, 
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="ApplicationStatus" component={ApplicationStatusScreen} />
        <Stack.Screen name="ApplyJob" component={ApplyJobScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="ManageCandidates" component={ManageCandidatesScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
        <Stack.Screen name="JobSearch" component={JobSearchScreen} />
        <Stack.Screen name="PostJob" component={PostJobScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="ManageCVs" component={ManageCVsScreen} />
        <Stack.Screen name="ViewCV" component={ViewCVScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
