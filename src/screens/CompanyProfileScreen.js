import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  TextInput 
} from 'react-native';
import { getCompanyProfile, updateCompanyProfile } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

const CompanyProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    founded: '',
    website: '',
    description: '',
    culture: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getCompanyProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch company profile:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateCompanyProfile(profile);
      alert('Company profile updated successfully');
    } catch (error) {
      alert('Failed to update company profile');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="business" size={60} color="#6D28D9" />
          </View>
        </View>
        <Text style={styles.title}>Company Profile</Text>
        <View style={styles.formContainer}>
          <ProfileInput
            icon="business-outline"
            value={profile.companyName}
            onChangeText={(text) => setProfile({ ...profile, companyName: text })}
            placeholder="Company Name"
          />
          <ProfileInput
            icon="briefcase-outline"
            value={profile.industry}
            onChangeText={(text) => setProfile({ ...profile, industry: text })}
            placeholder="Industry"
          />
          <ProfileInput
            icon="people-outline"
            value={profile.companySize}
            onChangeText={(text) => setProfile({ ...profile, companySize: text })}
            placeholder="Company Size"
          />
          <ProfileInput
            icon="calendar-outline"
            value={profile.founded}
            onChangeText={(text) => setProfile({ ...profile, founded: text })}
            placeholder="Founded Year"
          />
          <ProfileInput
            icon="globe-outline"
            value={profile.website}
            onChangeText={(text) => setProfile({ ...profile, website: text })}
            placeholder="Website"
          />
          <ProfileInput
            icon="document-text-outline"
            value={profile.description}
            onChangeText={(text) => setProfile({ ...profile, description: text })}
            placeholder="Company Description"
            multiline
          />
          <ProfileInput
            icon="heart-outline"
            value={profile.culture}
            onChangeText={(text) => setProfile({ ...profile, culture: text })}
            placeholder="Company Culture"
            multiline
          />
        </View>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update Company Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ProfileInput = ({ icon, value, onChangeText, placeholder, multiline }) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={24} color="#6D28D9" style={styles.icon} />
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
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
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
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
});

export default CompanyProfileScreen;