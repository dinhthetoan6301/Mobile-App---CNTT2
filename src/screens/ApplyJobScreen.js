import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUserCVs, applyForJob } from '../api/api';

const ApplyJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedCV, setSelectedCV] = useState('');
  const [cvs, setCVs] = useState([]);

  useEffect(() => {
    fetchUserCVs();
  }, []);

  const fetchUserCVs = async () => {
    try {
      const userCVs = await getUserCVs();
      setCVs(userCVs);
      if (userCVs.length > 0) {
        setSelectedCV(userCVs[0]._id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch your CVs');
    }
  };

  const handleApply = async () => {
    if (!selectedCV) {
      Alert.alert('Error', 'Please select a CV');
      return;
    }
    try {
      await applyForJob(jobId, { cvId: selectedCV, coverLetter });
      Alert.alert('Success', 'Application submitted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apply for Job</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select CV:</Text>
        <Picker
          selectedValue={selectedCV}
          onValueChange={(itemValue) => setSelectedCV(itemValue)}
          style={styles.picker}
        >
          {cvs.map((cv) => (
            <Picker.Item key={cv._id} label={cv.name} value={cv._id} />
          ))}
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Cover Letter"
        value={coverLetter}
        onChangeText={setCoverLetter}
      />
      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>Submit Application</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    marginTop: 100,
    textAlign: 'center',
    color: '#6D28D9',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  applyButton: {
    backgroundColor: '#6D28D9',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplyJobScreen;