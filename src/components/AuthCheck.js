import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../context/AppContext';
import api from '../api/api';

const AuthCheck = () => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          const response = await api.get('/users/profile');
          dispatch({ type: 'SET_USER', payload: response.data });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          await AsyncStorage.removeItem('userToken');
        }
      }
    };
    checkToken();
  }, []);

  return null;
};

export default AuthCheck;