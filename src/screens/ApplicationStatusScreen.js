import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { getApplicationStatus } from '../api/api';

const ApplicationStatusScreen = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplicationStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApplicationStatus();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching application status:', error);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplicationStatus();
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.jobTitle}>{item.job.title}</Text>
      <Text style={styles.company}>{item.job.company}</Text>
      <Text style={styles.status}>Status: <Text style={getStatusStyle(item.status)}>{item.status}</Text></Text>
      <Text style={styles.date}>Applied on: {new Date(item.appliedDate).toLocaleDateString()}</Text>
    </View>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return styles.pendingStatus;
      case 'Shortlisted':
        return styles.shortlistedStatus;
      case 'Rejected':
        return styles.rejectedStatus;
      case 'Accepted':
        return styles.acceptedStatus;
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Applications</Text>
      {applications.length === 0 ? (
        <Text style={styles.noApplications}>You haven't applied to any jobs yet.</Text>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
    color: '#6D28D9',
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  company: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 5,
  },
  status: {
    fontSize: 16,
    marginTop: 10,
  },
  pendingStatus: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  shortlistedStatus: {
    color: '#008000',
    fontWeight: 'bold',
  },
  rejectedStatus: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  acceptedStatus: {
    color: '#0000FF',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  noApplications: {
    textAlign: 'center',
    fontSize: 16,
    color: '#4B5563',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ApplicationStatusScreen;