import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { Octicons, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppContext } from '../context/AppContext';
import { register } from '../api/api';
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  Colors
} from './../components/styles';

// Colors
const { darkLight, brand, primary } = Colors;

// Keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// Custom Checkbox component
const CustomCheckbox = ({ label, value, onValueChange }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
      {value && <Ionicons name="checkmark" size={18} color="white" />}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

const Signup = ({ navigation }) => {
  const { dispatch } = useAppContext();
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [dob, setDob] = useState();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDob(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const handleSignup = async (credentials, setSubmitting) => {
    handleMessage(null);
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await register(credentials);
      console.log('Registration result:', result);
      if (result.status === 'SUCCESS') {
        handleMessage('Registration successful!', 'SUCCESS');
        navigation.navigate('Login', { email: credentials.email });
      } else {
        handleMessage(result.message || 'Registration failed', 'FAILED');
      }
    } catch (error) {
      console.error('Signup error:', error);
      handleMessage('An error occurred. Please try again later.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <InnerContainer>
          <PageTitle>Job Finder App</PageTitle>
          <SubTitle>Account Signup</SubTitle>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <Formik
            initialValues={{ 
              name: '', 
              email: '', 
              dateOfBirth: '', 
              password: '', 
              confirmPassword: '', 
              role: {
                jobseeker: false,
                employer: false
              },
              gender: {
                male: false,
                female: false,
                other: false
              }
            }}
            onSubmit={(values, { setSubmitting }) => {
              values = { ...values, dateOfBirth: dob };
              if (
                values.email == '' || 
                values.password == '' || 
                values.name == '' || 
                values.dateOfBirth == '' || 
                values.confirmPassword == '' || 
                (!values.role.jobseeker && !values.role.employer) ||
                (!values.gender.male && !values.gender.female && !values.gender.other)
              ) {
                handleMessage('Please fill all the fields');
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage('Passwords do not match');
                setSubmitting(false);
              } else {
                // Convert checkbox values to single string values
                const roleValue = values.role.jobseeker ? 'jobseeker' : 'employer';
                let genderValue = 'other';
                if (values.gender.male) genderValue = 'male';
                else if (values.gender.female) genderValue = 'female';

                const formattedValues = {
                  ...values,
                  role: roleValue,
                  gender: genderValue
                };
                handleSignup(formattedValues, setSubmitting);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Full Name"
                  icon="person"
                  placeholder="Nguyen Van A"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                <MyTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="example@gmail.com"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
                <MyTextInput
                  label="Date of Birth"
                  icon="calendar"
                  placeholder="YYYY - MM - DD"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')}
                  value={dob ? dob.toDateString() : ''}
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatepicker}
                />
                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MyTextInput
                  label="Confirm Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                
                <View>
                  <StyledInputLabel>Gender</StyledInputLabel>
                  <View style={styles.checkboxGroup}>
                    <CustomCheckbox
                      label="Male"
                      value={values.gender.male}
                      onValueChange={(newValue) => {
                        setFieldValue('gender', { male: newValue, female: false, other: false });
                      }}
                    />
                    <CustomCheckbox
                      label="Female"
                      value={values.gender.female}
                      onValueChange={(newValue) => {
                        setFieldValue('gender', { male: false, female: newValue, other: false });
                      }}
                    />
                    <CustomCheckbox
                      label="Other"
                      value={values.gender.other}
                      onValueChange={(newValue) => {
                        setFieldValue('gender', { male: false, female: false, other: newValue });
                      }}
                    />
                  </View>
                </View>

                <View>
                  <StyledInputLabel>Are you a Job seeker or an Employer?</StyledInputLabel>
                  <View style={styles.checkboxGroup}>
                    <CustomCheckbox
                      label="Job Seeker"
                      value={values.role.jobseeker}
                      onValueChange={(newValue) => {
                        setFieldValue('role', { jobseeker: newValue, employer: !newValue });
                      }}
                    />
                    <CustomCheckbox
                      label="Employer"
                      value={values.role.employer}
                      onValueChange={(newValue) => {
                        setFieldValue('role', { jobseeker: !newValue, employer: newValue });
                      }}
                    />
                  </View>
                </View>

                <MsgBox type={messageType}>{message}</MsgBox>

                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Signup</ButtonText>
                  </StyledButton>
                )}
                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}

                <Line />
                <ExtraView>
                  <ExtraText>Already have an account? </ExtraText>
                  <TextLink onPress={() => navigation.navigate('Login')}>
                    <TextLinkContent>Login</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {!isDate && <StyledTextInput {...props} />}
      {isDate && (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      )}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: brand,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  checkboxChecked: {
    backgroundColor: brand,
  },
  checkboxLabel: {
    fontSize: 16,
    color: darkLight,
  },
});

export default Signup;