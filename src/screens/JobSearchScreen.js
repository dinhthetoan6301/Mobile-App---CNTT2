import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  TextInput,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const JobSearchScreen = ({ navigation }) => {
  const { state } = useAppContext();
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    jobType: '',
  });
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Perform initial search with empty params to show all jobs
    handleSearch();
  }, []);

  const handleSearch = () => {
    const filteredJobs = state.jobs.filter(job => {
      const keywordMatch = job.title.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchParams.keyword.toLowerCase());
      const locationMatch = job.location.toLowerCase().includes(searchParams.location.toLowerCase());
      const jobTypeMatch = job.type.toLowerCase().includes(searchParams.jobType.toLowerCase());

      return keywordMatch && locationMatch && jobTypeMatch;
    });

    setSearchResults(filteredJobs);

    if (filteredJobs.length === 0) {
      Alert.alert('No Results', 'No jobs found matching your criteria');
    }
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.jobItem} 
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobCompany}>{item.company}</Text>
      <Text style={styles.jobLocation}>{item.location}</Text>
      <Text style={styles.jobType}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Find Your Dream Job</Text>
        <View style={styles.searchContainer}>
          <SearchInput
            icon="search-outline"
            placeholder="Job title or keywords"
            value={searchParams.keyword}
            onChangeText={(text) => setSearchParams({ ...searchParams, keyword: text })}
          />
          <SearchInput
            icon="location-outline"
            placeholder="Location"
            value={searchParams.location}
            onChangeText={(text) => setSearchParams({ ...searchParams, location: text })}
          />
          <SearchInput
            icon="briefcase-outline"
            placeholder="Job Type (e.g., Full-time, Part-time)"
            value={searchParams.jobType}
            onChangeText={(text) => setSearchParams({ ...searchParams, jobType: text })}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search Jobs</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.resultsTitle}>Search Results ({searchResults.length})</Text>
        <FlatList
          data={searchResults}
          renderItem={renderJobItem}
          keyExtractor={(item) => item._id}
          style={styles.jobList}
          ListEmptyComponent={<Text style={styles.noResults}>No jobs found</Text>}
        />
      </ScrollView>
    </View>
  );
};

const SearchInput = ({ icon, placeholder, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={24} color="#6D28D9" style={styles.icon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
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
  jobList: {
    marginTop: 10,
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
});

export default JobSearchScreen;