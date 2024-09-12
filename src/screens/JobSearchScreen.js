import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Picker } from '@react-native-picker/picker';

const SearchInput = React.memo(({ icon, placeholder, value, onChangeText, onSubmitEditing }) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={24} color="#6D28D9" style={styles.icon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="next"
    />
  </View>
));

const JobSearchScreen = ({ navigation }) => {
  const { state } = useAppContext();
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    jobType: '',
    salary: { min: '', max: '' },
  });
  const [searchResults, setSearchResults] = useState([]);
  const flatListRef = useRef(null);

  const updateSearchParams = useCallback((key, value) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    Keyboard.dismiss();
  
    const filteredJobs = state.jobs.filter(job => {
      const keywordMatch = job.title.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchParams.keyword.toLowerCase());
      const locationMatch = job.location.toLowerCase().includes(searchParams.location.toLowerCase());
      const jobTypeMatch = job.type.toLowerCase().includes(searchParams.jobType.toLowerCase());
  
      // Ensure salary values are numbers for comparison
      const jobMinSalary = parseFloat(job.salary?.min) || 0;
      const jobMaxSalary = parseFloat(job.salary?.max) || Infinity;
      const minSalary = parseFloat(searchParams.salary.min) || 0;
      const maxSalary = parseFloat(searchParams.salary.max) || Infinity;
  
      const salaryMatch = jobMinSalary >= minSalary && jobMaxSalary <= maxSalary;
  
      return keywordMatch && locationMatch && jobTypeMatch && salaryMatch;
    });
  
    setSearchResults(filteredJobs);
  
    if (filteredJobs.length === 0) {
      Alert.alert('No Results', 'No jobs found matching your criteria');
    }
  
    // Scroll to top of results
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [searchParams, state.jobs]);

  useEffect(() => {
    handleSearch();
  }, []); 

  const renderJobItem = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.jobItem} 
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobCompany}>{item.company}</Text>
      <Text style={styles.jobLocation}>{item.location}</Text>
      <Text style={styles.jobType}>{item.type}</Text>
      <Text style={styles.jobSalary}>
          Salary: {item.salary?.min} - {item.salary?.max} USD
      </Text>
    </TouchableOpacity>
  ), [navigation]);

  const ListHeaderComponent = useMemo(() => (
    <>
      <Text style={styles.title}>Find Your Dream Job</Text>
      <View style={styles.searchContainer}>
        <SearchInput
          icon="search-outline"
          placeholder="Job title or keywords"
          value={searchParams.keyword}
          onChangeText={(text) => updateSearchParams('keyword', text)}
          onSubmitEditing={() => {}}
        />
        <SearchInput
          icon="location-outline"
          placeholder="Location"
          value={searchParams.location}
          onChangeText={(text) => updateSearchParams('location', text)}
          onSubmitEditing={() => {}}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Job Type</Text>
          <Picker
            selectedValue={searchParams.jobType}
            style={styles.picker}
            onValueChange={(itemValue) => updateSearchParams('jobType', itemValue)}
          >
            <Picker.Item label="Select Job Type" value="" />
            <Picker.Item label="Full-time" value="Full-time" />
            <Picker.Item label="Part-time" value="Part-time" />
            <Picker.Item label="Internship" value="Internship" />
            <Picker.Item label="Freelance" value="Freelance" />
          </Picker>
        </View>
        <View style={styles.salaryContainer}>
          <Text style={styles.pickerLabel}>Salary</Text>
          <TextInput
            style={styles.input}
            placeholder="Min Salary"
            keyboardType="numeric"
            value={searchParams.salary.min}
            onChangeText={(text) => updateSearchParams('salary', { ...searchParams.salary, min: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Max Salary"
            keyboardType="numeric"
            value={searchParams.salary.max}
            onChangeText={(text) => updateSearchParams('salary', { ...searchParams.salary, max: text })}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search Jobs</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.resultsTitle}>Search Results ({searchResults.length})</Text>
    </>
  ), [searchParams, updateSearchParams, handleSearch, searchResults.length]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={searchResults}
        renderItem={renderJobItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={<Text style={styles.noResults}>No jobs found</Text>}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
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
  searchContainer: {
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
  searchButton: {
    backgroundColor: '#6D28D9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B5563',
    marginTop: 20,
    marginBottom: 10,
  },
  jobItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  jobCompany: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 5,
  },
  jobLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  jobType: {
    fontSize: 14,
    color: '#6D28D9',
    marginTop: 5,
  },
  noResults: {
    textAlign: 'center',
    color: '#4B5563',
    marginTop: 20,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6D28D9',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  salaryContainer: {
    marginBottom: 15,
  },
  jobSalary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28A745', 
    marginBottom: 5,
  },
});

export default JobSearchScreen;
