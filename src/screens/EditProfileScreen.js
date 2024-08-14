import React, { useState, useEffect } from 'react';
import { updateUserProfile } from '../api/api';
import { useAppContext } from '../context/AppContext';
import {
  StyledContainer,
  PageTitle,
  StyledFormArea,
  StyledTextInput,
  StyledButton,
  ButtonText,
  MsgBox,
  CenteredView
} from '../components/styles';

const EditProfileScreen = ({ navigation }) => {
  const { state, dispatch } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user profile data
    if (state.user) {
      setName(state.user.name || '');
      setEmail(state.user.email || '');
      setPhone(state.user.phone || '');
      setBio(state.user.bio || '');
    }
  }, [state.user]);

  const handleSave = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedUser = await updateUserProfile(state.user.id, { name, email, phone, bio });
      dispatch({ type: 'SET_USER', payload: updatedUser });
      setMessage('Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      setMessage('Failed to update profile');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <StyledContainer>
      <CenteredView>
        <PageTitle>Edit Profile</PageTitle>
        <StyledFormArea>
          <StyledTextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <StyledTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <StyledTextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <StyledTextInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
          <StyledButton onPress={handleSave}>
            <ButtonText>Save Changes</ButtonText>
          </StyledButton>
          <MsgBox>{message}</MsgBox>
        </StyledFormArea>
      </CenteredView>
    </StyledContainer>
  );
};

export default EditProfileScreen;