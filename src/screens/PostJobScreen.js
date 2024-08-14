import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { postJob } from '../api/api';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const PostJobScreen = ({ navigation }) => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    benefits: '',
    salary: { min: '', max: '', currency: 'USD' },
    location: '',
    type: '',
    industry: '',
    applicationDeadline: new Date(),
    numberOfPositions: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePostJob = async () => {
    try {
      await postJob({
        ...jobData,
        numberOfPositions: parseInt(jobData.numberOfPositions) || 1,
      });
      Alert.alert('Success', 'Job posted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to post job');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || jobData.applicationDeadline;
    setShowDatePicker(Platform.OS === 'ios');
    setJobData({ ...jobData, applicationDeadline: currentDate });
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Post a Job</Text>
        <View style={styles.formContainer}>
          <JobInput
            icon="briefcase-outline"
            value={jobData.title}
            onChangeText={(text) => setJobData({ ...jobData, title: text })}
            placeholder="Job Title"
          />
          <JobInput
            icon="business-outline"
            value={jobData.company}
            onChangeText={(text) => setJobData({ ...jobData, company: text })}
            placeholder="Company Name"
          />
          <JobInput
            icon="document-text-outline"
            value={jobData.description}
            onChangeText={(text) => setJobData({ ...jobData, description: text })}
            placeholder="Job Description"
            multiline
          />
          <JobInput
            icon="list-outline"
            value={jobData.requirements}
            onChangeText={(text) => setJobData({ ...jobData, requirements: text })}
            placeholder="Requirements (comma separated)"
            multiline
          />
          <JobInput
            icon="gift-outline"
            value={jobData.benefits}
            onChangeText={(text) => setJobData({ ...jobData, benefits: text })}
            placeholder="Benefits (comma separated)"
            multiline
          />
          <View style={styles.salaryContainer}>
            <JobInput
              icon="cash-outline"
              value={jobData.salary.min}
              onChangeText={(text) => setJobData({ ...jobData, salary: { ...jobData.salary, min: text } })}
              placeholder="Min Salary"
              keyboardType="numeric"
              style={styles.salaryInput}
            />
            <JobInput
              icon="cash-outline"
              value={jobData.salary.max}
              onChangeText={(text) => setJobData({ ...jobData, salary: { ...jobData.salary, max: text } })}
              placeholder="Max Salary"
              keyboardType="numeric"
              style={styles.salaryInput}
            />
          </View>
          <JobInput
            icon="people-outline"
            value={jobData.numberOfPositions}
            onChangeText={(text) => setJobData({...jobData, numberOfPositions: text})}
            placeholder="Number of Positions"
            keyboardType="numeric"
          />
          <JobInput
            icon="location-outline"
            value={jobData.location}
            onChangeText={(text) => setJobData({ ...jobData, location: text })}
            placeholder="Location"
          />
          <JobInput
            icon="time-outline"
            value={jobData.type}
            onChangeText={(text) => setJobData({ ...jobData, type: text })}
            placeholder="Job Type (e.g., Full-time, Part-time)"
          />
          <JobInput
            icon="business-outline"
            value={jobData.industry}
            onChangeText={(text) => setJobData({ ...jobData, industry: text })}
            placeholder="Industry"
          />
          <TouchableOpacity onPress={showDatepicker}>
            <JobInput
              icon="calendar-outline"
              value={jobData.applicationDeadline.toDateString()}
              placeholder="Application Deadline"
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={jobData.applicationDeadline}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>
        <TouchableOpacity style={styles.postButton} onPress={handlePostJob}>
          <Text style={styles.postButtonText}>Post Job</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const JobInput = ({ icon, value, onChangeText, placeholder, multiline, keyboardType, style, editable }) => (
  <View style={[styles.inputContainer, style]}>
    <Ionicons name={icon} size={24} color="#6D28D9" style={styles.icon} />
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
      keyboardType={keyboardType || 'default'}
      editable={editable !== false}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6D28D9',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
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
  salaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  salaryInput: {
    flex: 1,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: '#6D28D9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostJobScreen;