import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const JobDetailsScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const { state } = useAppContext();

  const handleApply = () => {
    if (!state.user) {
      Alert.alert('Login Required', 'Please login to apply for this job.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }
    if (state.user.role !== 'jobseeker') {
      Alert.alert('Error', 'Only job seekers can apply for jobs.');
      return;
    }
    
    navigation.navigate('ApplyJob', { jobId: job._id });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Job Details</Text>
        <Text style={styles.namejob}>{job.title}</Text>
        <Text style={styles.company}>Company name: {job.company}</Text>
        
        <View style={styles.infoContainer}>
          <InfoItem icon="location-outline" text={job.location} />
          <InfoItem icon="cash-outline" text={`$${job.salary.min} - $${job.salary.max}`} />
          <InfoItem icon="briefcase-outline" text={job.type} />
          <InfoItem 
            icon="people-outline" 
            text={`${job.numberOfPositions} position${job.numberOfPositions !== 1 ? 's' : ''}`} 
          />
          <InfoItem 
            icon="calendar-outline" 
            text={`Deadline: ${new Date(job.applicationDeadline).toLocaleDateString()}`} 
          />
        </View>
        
        <Section title="Job Description">
          <Text style={styles.description}>{job.description}</Text>
        </Section>
        
        <Section title="Requirements">
          <BulletList items={job.requirements} />
        </Section>
        
        <Section title="Benefits">
          <BulletList items={job.benefits} />
        </Section>
        
        {/* Only show Apply button if user is a jobseeker */}
        {state.user && state.user.role === 'jobseeker' && (
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply for this Job</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={20} color="#6D28D9" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const BulletList = ({ items }) => (
  <View>
    {items.map((item, index) => (
      <View key={index} style={styles.bulletItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
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
  namejob: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  company: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    marginLeft: 10,
    color: '#4B5563',
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  description: {
    color: '#4B5563',
    lineHeight: 24,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    marginRight: 5,
    color: '#6D28D9',
  },
  bulletText: {
    flex: 1,
    color: '#4B5563',
  },
  applyButton: {
    backgroundColor: '#6D28D9',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobDetailsScreen;
