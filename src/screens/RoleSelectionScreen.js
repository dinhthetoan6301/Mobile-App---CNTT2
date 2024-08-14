import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateUserRole } from '../api/api';
import { useAppContext } from '../context/AppContext';

const RoleSelectionScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useAppContext();

  const handleRoleSelection = async (role) => {
    try {
      await updateUserRole(state.user._id, role);
      dispatch({ type: 'UPDATE_USER_ROLE', payload: role });
      navigation.navigate('Homepage');
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you a job seeker or an employer?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelection('jobseeker')}
      >
        <Text style={styles.buttonText}>Job Seeker</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelection('employer')}
      >
        <Text style={styles.buttonText}>Employer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6D28D9',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default RoleSelectionScreen;