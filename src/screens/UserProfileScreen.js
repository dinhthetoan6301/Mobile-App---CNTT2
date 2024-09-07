import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  TextInput 
} from 'react-native';
import { getUserProfile, updateUserProfile } from '../api/api';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext'; 

const UserProfileScreen = ({ navigation }) => {
  const { state } = useAppContext(); 
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    company: '',
    gender: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUserProfile(profile);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={60} color="#6D28D9" />
          </View>
        </View>
        <Text style={styles.title}>User Profile</Text>
        <View style={styles.formContainer}>
          <ProfileInput
            icon="person-outline"
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="John Doe"
          />
          <ProfileInput
            icon="mail-outline"
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
            placeholder="example@gmail.com"
            keyboardType="email-address"
          />
          <ProfileInput
            icon="call-outline"
            value={profile.phoneNumber}
            onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })}
            placeholder="+1234567890"
            keyboardType="phone-pad"
          />
          <ProfileInput
            icon="home-outline"
            value={profile.address}
            onChangeText={(text) => setProfile({ ...profile, address: text })}
            placeholder="123 Main St, City, Country"
          />
          <ProfileInput
            icon="business-outline"
            value={profile.company}
            onChangeText={(text) => setProfile({ ...profile, company: text })}
            placeholder="Company Name"
          />
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#6D28D9" style={styles.icon} />
            <Picker
              selectedValue={profile.gender}
              onValueChange={(itemValue) => setProfile({ ...profile, gender: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {state.user && state.user.role === 'jobseeker' && (
          <TouchableOpacity 
            style={styles.manageCVsButton} 
            onPress={() => navigation.navigate('ManageCVs')}>
            <Text style={styles.manageCVsButtonText}>Manage My CVs</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ProfileInput = ({ icon, value, onChangeText, placeholder, keyboardType }) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={24} color="#6D28D9" style={styles.icon} />
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType || 'default'}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollViewContent: {
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6D28D9',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#1F2937',
  },
  picker: {
    flex: 1,
    color: '#1F2937',
  },
  updateButton: {
    backgroundColor: '#6D28D9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manageCVsButton: {
    backgroundColor: '#4B5563',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  manageCVsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default UserProfileScreen;