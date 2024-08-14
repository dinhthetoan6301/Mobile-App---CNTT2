import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPostedJobs, updateJob, deleteJob, getCandidates, updateApplicationStatus } from '../api/api';
import { useAppContext } from '../context/AppContext'; // Giả sử bạn có một context để lưu thông tin người dùng

const JobItem = ({ job, onViewCandidates, onEdit, onDelete }) => (
  <View style={styles.jobItem}>
    <View style={styles.jobHeader}>
      <Text style={styles.jobTitle}>{job.title}</Text>
      <TouchableOpacity onPress={() => onDelete(job._id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="#FF4136" />
      </TouchableOpacity>
    </View>
    <Text style={styles.jobCompany}>{job.company}</Text>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={() => onViewCandidates(job)}>
        <Ionicons name="people-outline" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>View Candidates</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => onEdit(job)}>
        <Ionicons name="create-outline" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CandidateItem = ({ candidate, onUpdateStatus }) => (
  <View style={styles.candidateItem}>
    <Text style={styles.candidateName}>{candidate.applicant.name}</Text>
    <Text style={styles.candidateEmail}>{candidate.applicant.email}</Text>
    <Text style={styles.candidateStatus}>Status: {candidate.status}</Text>
    <View style={styles.statusButtonContainer}>
      <TouchableOpacity
        style={[styles.statusButton, candidate.status === 'Shortlisted' && styles.activeStatusButton]}
        onPress={() => onUpdateStatus(candidate._id, 'Shortlisted')}
      >
        <Text style={styles.statusButtonText}>Shortlist</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.statusButton, candidate.status === 'Rejected' && styles.activeStatusButton]}
        onPress={() => onUpdateStatus(candidate._id, 'Rejected')}
      >
        <Text style={styles.statusButtonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ManageCandidatesScreen = ({ navigation }) => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editJobData, setEditJobData] = useState({});
  const [loading, setLoading] = useState(true);
  const { state } = useAppContext(); // Sử dụng context để lấy thông tin người dùng

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const fetchPostedJobs = async () => {
    setLoading(true);
    try {
      const jobs = await getPostedJobs();
      // Lọc chỉ những công việc do người dùng hiện tại đăng
      const userJobs = jobs.filter(job => job.postedBy === state.user._id);
      setPostedJobs(userJobs);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch posted jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobPress = async (job) => {
    setSelectedJob(job);
    try {
      const jobCandidates = await getCandidates(job._id);
      setCandidates(jobCandidates);
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch candidates');
    }
  };

  const handleEditJob = (job) => {
    setEditJobData(job);
    setEditModalVisible(true);
  };

  const handleUpdateJob = async () => {
    try {
      await updateJob(editJobData._id, editJobData);
      setEditModalVisible(false);
      fetchPostedJobs();
      Alert.alert('Success', 'Job updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteJob(jobId);
              fetchPostedJobs();
              Alert.alert('Success', 'Job deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete job');
            }
          }
        }
      ]
    );
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      const updatedCandidates = candidates.map(candidate =>
        candidate._id === applicationId ? {...candidate, status: newStatus} : candidate
      );
      setCandidates(updatedCandidates);
      Alert.alert('Success', 'Application status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update application status');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Jobs</Text>
      {postedJobs.length === 0 ? (
        <Text style={styles.noJobsText}>You haven't posted any jobs yet.</Text>
      ) : (
        <FlatList
          data={postedJobs}
          renderItem={({ item }) => (
            <JobItem
              job={item}
              onViewCandidates={handleJobPress}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Candidates for {selectedJob?.title}</Text>
            {candidates.length > 0 ? (
              <FlatList
                data={candidates}
                renderItem={({ item }) => (
                  <CandidateItem
                    candidate={item}
                    onUpdateStatus={handleStatusUpdate}
                  />
                )}
                keyExtractor={item => item._id}
              />
            ) : (
              <Text style={styles.noCandidatesText}>No candidates have applied for this job yet.</Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Job</Text>
            <TextInput
              style={styles.input}
              value={editJobData.title}
              onChangeText={(text) => setEditJobData({...editJobData, title: text})}
              placeholder="Job Title"
            />
            <TextInput
              style={styles.input}
              value={editJobData.company}
              onChangeText={(text) => setEditJobData({...editJobData, company: text})}
              placeholder="Company"
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={editJobData.description}
              onChangeText={(text) => setEditJobData({...editJobData, description: text})}
              placeholder="Description"
              multiline
            />
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateJob}>
              <Text style={styles.buttonText}>Update Job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6D28D9',
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  jobItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  noJobsText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  noCandidatesText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  jobCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  candidateItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  candidateEmail: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  candidateStatus: {
    fontSize: 14,
    color: '#6D28D9',
    marginTop: 4,
    fontWeight: 'bold',
  },
  statusButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  activeStatusButton: {
    backgroundColor: '#6D28D9',
  },
  statusButtonText: {
    color: '#4B5563',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#4B5563',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ManageCandidatesScreen;