import React, { useState } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import {
  HeaderContainer,
  AvatarContainer,
  MenuContainer,
  MenuItem,
  MenuItemText,
  HeaderTitle
} from '../components/styles';

const Header = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleUserPress = () => {
    setShowMenu(!showMenu);
  };

  const handleProfilePress = () => {
    setShowMenu(false);
    navigation.navigate('UserProfile');
  };

  const handleLogout = () => {
    setShowMenu(false);
    // Implement logout logic here
    console.log('Logout pressed');
  };

  return (
    <HeaderContainer>
      <HeaderTitle>Job Finder</HeaderTitle>
      <AvatarContainer>
        <TouchableOpacity onPress={handleUserPress}>
          <Image 
            source={require('../assets/img/avatar1.png')} 
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
        </TouchableOpacity>
        {showMenu && (
          <MenuContainer>
            <MenuItem onPress={handleProfilePress}>
              <MenuItemText>User Profile</MenuItemText>
            </MenuItem>
            <MenuItem onPress={handleLogout}>
              <MenuItemText>Logout</MenuItemText>
            </MenuItem>
          </MenuContainer>
        )}
      </AvatarContainer>
    </HeaderContainer>
  );
};

export default Header;