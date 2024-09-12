import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { getUserCVs, uploadCV, deleteCV } from '../api/api';

const ManageCVsScreen = ({ navigation }) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    setLoading(true);
    try {
      const userCVs = await getUserCVs();
      setCvs(userCVs);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setLoading(true);
        
        const response = await uploadCV(file.uri, file.name);
        if (response.success) {
          Alert.alert('Success', 'CV uploaded successfully');
          fetchCVs();
        } else {
          Alert.alert('Error', response.message || 'Failed to upload CV');
        }
      }
    } catch (error) {
      console.error('Error in handleUploadCV:', error);
      Alert.alert('Error', 'Failed to upload CV: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (cvId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this CV?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await deleteCV(cvId);
              if (response.success) {
                Alert.alert('Success', 'CV deleted successfully');
                fetchCVs();
              } else {
                Alert.alert('Error', response.message || 'Failed to delete CV');
              }
            } catch (error) {
              console.error('Error in handleDeleteCV:', error);
              Alert.alert('Error', 'Failed to delete CV: ' + error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderCVItem = ({ item }) => (
    <View style={styles.cvItem}>
      <Text style={styles.cvName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleDeleteCV(item._id)}>
        <Ionicons name="trash-outline" size={24} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your CVs</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadCV}>
        <Text style={styles.uploadButtonText}>Upload New CV</Text>
      </TouchableOpacity>
      <FlatList
        data={cvs}
        renderItem={renderCVItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No CVs uploaded yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6D28D9',
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#6D28D9',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cvItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  cvName: {
    fontSize: 16,
    color: '#1F2937',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
  },
});

export default ManageCVsScreen;
