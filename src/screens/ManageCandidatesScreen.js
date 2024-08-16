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
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPostedJobs, updateJob, deleteJob, getCandidates, updateApplicationStatus } from '../api/api';
import { useAppContext } from '../context/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';


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
  const [editJobData, setEditJobData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: [],
    benefits: [],
    salary: { min: '', max: '', currency: 'USD' },
    location: '',
    type: '',
    industry: '',
    applicationDeadline: new Date(),
    numberOfPositions: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const { state } = useAppContext();
  

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const fetchPostedJobs = async () => {
    setLoading(true);
    try {
      const jobs = await getPostedJobs();
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
    setEditJobData({
      ...job,
      salary: {
        min: job.salary.min.toString(),
        max: job.salary.max.toString(),
        currency: job.salary.currency
      },
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      numberOfPositions: job.numberOfPositions.toString(),
      applicationDeadline: new Date(job.applicationDeadline)
    });
    setEditModalVisible(true);
  };

  const handleUpdateJob = async () => {
    try {
      const updatedJobData = {
        ...editJobData,
        salary: {
          min: parseInt(editJobData.salary.min),
          max: parseInt(editJobData.salary.max),
          currency: editJobData.salary.currency
        },
        numberOfPositions: parseInt(editJobData.numberOfPositions),
        requirements: Array.isArray(editJobData.requirements) 
          ? editJobData.requirements 
          : editJobData.requirements.split(',').map(item => item.trim()),
        benefits: Array.isArray(editJobData.benefits)
          ? editJobData.benefits
          : editJobData.benefits.split(',').map(item => item.trim())
      };
      await updateJob(editJobData._id, updatedJobData);
      setEditModalVisible(false);
      fetchPostedJobs();
      Alert.alert('Success', 'Job updated successfully');
    } catch (error) {
      console.error('Error updating job:', error);
      Alert.alert('Error', 'Failed to update job');
    }
  };


  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || editJobData.applicationDeadline;
    setShowDatePicker(Platform.OS === 'ios');
    setEditJobData({ ...editJobData, applicationDeadline: currentDate });
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.modalTitle}>Edit Job</Text>
                <JobInput
                  label="Job Title"
                  value={editJobData.title}
                  onChangeText={(text) => setEditJobData({...editJobData, title: text})}
                />
            <JobInput
              label="Company"
              value={editJobData.company}
              onChangeText={(text) => setEditJobData({...editJobData, company: text})}
            />
            <JobInput
              label="Description"
              value={editJobData.description}
              onChangeText={(text) => setEditJobData({...editJobData, description: text})}
              multiline
            />
            <JobInput
              label="Requirements (comma separated)"
              value={Array.isArray(editJobData.requirements) ? editJobData.requirements.join(', ') : ''}
              onChangeText={(text) => setEditJobData({...editJobData, requirements: text.split(',').map(item => item.trim())})}
              multiline
            />
            <JobInput
              label="Benefits (comma separated)"
              value={Array.isArray(editJobData.benefits) ? editJobData.benefits.join(', ') : ''}
              onChangeText={(text) => setEditJobData({...editJobData, benefits: text.split(',').map(item => item.trim())})}
              multiline
            />
            <View style={styles.salaryContainer}>
              <JobInput
                label="Min Salary"
                value={editJobData.salary.min}
                onChangeText={(text) => setEditJobData({...editJobData, salary: {...editJobData.salary, min: text}})}
                keyboardType="numeric"
                style={styles.salaryInput}
              />
              <JobInput
                label="Max Salary"
                value={editJobData.salary.max}
                onChangeText={(text) => setEditJobData({...editJobData, salary: {...editJobData.salary, max: text}})}
                keyboardType="numeric"
                style={styles.salaryInput}
              />
            </View>
              <JobInput
                label="Location"
                value={editJobData.location}
                onChangeText={(text) => setEditJobData({...editJobData, location: text})}
              />
              <JobInput
                label="Job Type"
                value={editJobData.type}
                onChangeText={(text) => setEditJobData({...editJobData, type: text})}
              />
              <JobInput
                label="Industry"
                value={editJobData.industry}
                onChangeText={(text) => setEditJobData({...editJobData, industry: text})}
              />
              <JobInput
                label="Number of Positions"
                value={editJobData.numberOfPositions}
                onChangeText={(text) => setEditJobData({...editJobData, numberOfPositions: text})}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <JobInput
                  label="Application Deadline"
                  value={editJobData.applicationDeadline.toDateString()}
                  editable={false}
                />
              </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={editJobData.applicationDeadline}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateJob}>
              <Text style={styles.buttonText}>Update Job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const JobInput = ({ label, value, onChangeText, multiline, keyboardType, style, editable }) => (
  <View style={[styles.inputContainer, style]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType || 'default'}
      editable={editable !== false}
    />
  </View>
);

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
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
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

  modalContainer: {
    flex: 1,
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
  scrollViewContent: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6D28D9',
    textAlign: 'center',
  },
});

export default ManageCandidatesScreen;