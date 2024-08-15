import React, { useState, useCallback } from 'react';
import { TouchableOpacity, FlatList, View, Text, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getJobs } from '../api/api';
import { useAppContext } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  HomeContainer,
  Header,
  AvatarContainer,
  AvatarImage,
  MenuDropdown,
  MenuItem,
  MenuItemText,
  GreetingText,
  TitleText,
  SearchContainer,
  SearchInput,
  SearchIcon,
  JobTypeContainer,
  JobTypeButton,
  JobTypeText,
  SectionHeader,
  SectionTitle,
  ErrorText,
  PageTitle,
  JobItem,
  JobTitle,
  JobCompany,
  StyledButton,
  ButtonText,
} from '../components/styles';

const Homepage = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [showMenu, setShowMenu] = useState(false);
  const [allJobs, setAllJobs] = useState([]);

  const fetchJobs = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const jobsData = await getJobs();
      setAllJobs(jobsData);
      dispatch({ type: 'SET_JOBS', payload: jobsData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [fetchJobs])
  );

  const handleSearch = useCallback(() => {
    if (searchTerm.trim() === '') {
      dispatch({ type: 'SET_JOBS', payload: allJobs });
    } else {
      const filteredJobs = allJobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      dispatch({ type: 'SET_JOBS', payload: filteredJobs });
    }
  }, [searchTerm, allJobs, dispatch]);

  useFocusEffect(
    useCallback(() => {
      handleSearch();
    }, [handleSearch])
  );

  const handleAvatarPress = () => {
    setShowMenu(!showMenu);
  };

  const handleUserProfile = () => {
    setShowMenu(false);
    navigation.navigate('UserProfile');
  };

  const handleCompanyProfile = () => {
    setShowMenu(false);
    navigation.navigate('CompanyProfile');
  };

  const handleApplicationStatus = () => {
    setShowMenu(false);
    navigation.navigate('ApplicationStatus');
  };

  const handleLogout = useCallback(async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              dispatch({ type: 'LOGOUT' });
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  }, [dispatch, navigation]);

  const handleManageCandidates = () => {
    setShowMenu(false);
    navigation.navigate('ManageCandidates');
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { job: item })}>
      <JobItem>
        <JobTitle>{item.title}</JobTitle>
        <JobCompany>{item.company}</JobCompany>
        <Text>{item.type}</Text>
      </JobItem>
    </TouchableOpacity>
  );

  return (
    <HomeContainer>
      <View style={{ zIndex: 1000 }}>
        <Header>
          <PageTitle>Job Finder App</PageTitle>
          <AvatarContainer>
            <TouchableOpacity onPress={handleAvatarPress}>
              <AvatarImage source={require('../../assets/img/avatar1.png')} />
            </TouchableOpacity>
          </AvatarContainer>
        </Header>
        {showMenu && (
          <MenuDropdown>
            <MenuItem onPress={handleUserProfile}>
              <MenuItemText>User Profile</MenuItemText>
            </MenuItem>
            {state.user && state.user.role === 'employer' && (
              <>
                <MenuItem onPress={handleCompanyProfile}>
                  <MenuItemText>Company Profile</MenuItemText>
                </MenuItem>
                <MenuItem onPress={handleManageCandidates}>
                  <MenuItemText>Manage Posted Jobs</MenuItemText>
                </MenuItem>
              </>
            )}
            {state.user && state.user.role === 'jobseeker' && (
              <MenuItem onPress={handleApplicationStatus}>
                <MenuItemText>Application Status</MenuItemText>
              </MenuItem>
            )}
            <MenuItem onPress={handleLogout}>
              <MenuItemText style={{ color: 'red' }}>Logout</MenuItemText>
            </MenuItem>
          </MenuDropdown>
        )}
      </View>
      <GreetingText>Hello {state.user ? state.user.name : 'User'}</GreetingText>
      <TitleText>Find your perfect job</TitleText>
      <SearchContainer>
        <SearchInput
          placeholder="What are you looking for?"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity onPress={handleSearch}>
          <SearchIcon />
        </TouchableOpacity>
      </SearchContainer>
      <JobTypeContainer>
        {['All', 'Full-time', 'Part-time', 'Internship'].map((type) => (
          <JobTypeButton
            key={type}
            selected={selectedJobType === type}
            onPress={() => setSelectedJobType(type)}
          >
            <JobTypeText selected={selectedJobType === type}>{type}</JobTypeText>
          </JobTypeButton>
        ))}
      </JobTypeContainer>
      <SectionHeader>
        <SectionTitle>Popular jobs</SectionTitle>
      </SectionHeader>
      {state.isLoading ? (
        <ErrorText>Loading jobs...</ErrorText>
      ) : state.error ? (
        <ErrorText>{state.error}</ErrorText>
      ) : (
        <FlatList
          data={state.jobs.filter(job => selectedJobType === 'All' || job.type === selectedJobType)}
          renderItem={renderJobItem}
          keyExtractor={(item) => item._id}
        />
      )}
      {state.user && state.user.role === 'employer' && (
        <StyledButton onPress={() => navigation.navigate('PostJob')}>
          <ButtonText>Post a Job</ButtonText>
        </StyledButton>
      )}
      
      {state.user && state.user.role === 'jobseeker' && (
        <>
          <StyledButton onPress={() => navigation.navigate('JobSearch', { jobType: selectedJobType })}>
            <ButtonText>Search Jobs</ButtonText>
          </StyledButton>
        </>
      )}
    </HomeContainer>
  );
};

export default Homepage;