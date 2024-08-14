import styled from 'styled-components/native';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const StatusBarHeight = Constants.statusBarHeight;

// colors
export const Colors = {
    primary: "#ffffff",
    secondary: "#E5E7EB",
    tertiary: "#1F2937",
    darkLight: "#9CA3AF",
    brand: "#6D28D9",
    green: "#10B981",
    red: "#EF4444",
};

const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight + 30}px;
    background-color: ${primary};
`;

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const WelcomeContainer = styled(InnerContainer)`
    padding: 25px;
    padding-top: 10px;
    justify-content: center;
`;

export const PageLogo = styled.Image`
    width: 250px;
    height: 200px;
`;

export const Avatar = styled.Image`
    width: 100px;
    height: 100px;
    margin: auto;
    border-radius: 50px;
    border-width: 2px;
    border-color: ${secondary};
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const WelcomeImage = styled.Image`
    height: 45%;
    min-width: 100%;
`;

export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;

    ${(props) => props.welcome && `
       font-size: 20px;
    `}
`;

export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};

    ${(props) => props.welcome && `
        margin-bottom: 5px;
        font-weight: normal;
    `}
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const StyledTextInput = styled.TextInput`
    background-color: ${secondary};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 5px;
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
    color: ${tertiary};
    font-size: 13px;
    text-align: left;
`;

export const LeftIcon = styled.View`
    left: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
    right: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${brand};
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-vertical: 5px;
    height: 60px;

    ${(props) => props.google == true && `
        background-color: ${green};
        flex-direction: row;
        justify-content: center;
    `}
`;

export const ButtonText = styled.Text`
    color: ${primary};
    font-size: 16px;

    ${(props) => props.google == true && `
        padding-left: 25px;
        padding-right: 25px;
    `}
`;

export const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${props => props.type === 'SUCCESS' ? 'green' : 'red'};
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Line = styled.View`
    height: 1px;
    width: 100%;
    background-color: ${darkLight};
    margin-vertical: 10px;
`;

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;

export const ExtraText = styled.Text`
    justify-content: center;
    align-content: center;
    color: ${tertiary};
    font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;

export const TextLinkContent = styled.Text`
    color: ${brand};
    font-size: 15px;
`;

// New styles for Edit Profile Screen
export const CenteredView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

// Styles for HomePage
export const HomeContainer = styled.View`
    flex: 1;
    padding: 20px;
    background-color: #FFFFFF;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 30px 5px;
`;

export const AvatarContainer = styled.View`
    position: relative;
`;

export const AvatarImage = styled.Image`
    width: 65px;
    height: 65px;
    border-radius: 30px;
`;

export const MenuDropdown = styled.View`
    position: absolute;
    top: 80px;
    right: 0;
    background-color: white;
    border-radius: 5px;
    elevation: 5;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    padding: 5px;
    width: 150px;
`;

export const MenuItem = styled.TouchableOpacity`
    padding: 10px;
`;

export const MenuItemText = styled.Text`
    font-size: 14px;
    color: #333;
`;

export const GreetingText = styled.Text`
    font-size: 16px;
    color: #666;
`;

export const TitleText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
`;

export const SearchContainer = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: #F0F0F0;
    border-radius: 25px;
    padding: 10px;
    margin-bottom: 20px;
`;

export const SearchInput = styled.TextInput`
    flex: 1;
    font-size: 16px;
    color: #333;
`;

export const SearchIcon = styled(Ionicons).attrs({
    name: 'search-outline',
    size: 24,
    color: '#FF7F50',
})``;

export const JobTypeContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
`;

export const JobTypeButton = styled.TouchableOpacity`
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px solid #DDD;
    background-color: ${props => props.selected ? '#FF7F50' : 'transparent'};
`;

export const JobTypeText = styled.Text`
    color: ${props => props.selected ? '#FFF' : '#666'};
`;

export const SectionHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

export const SectionTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
`;

export const ShowAllText = styled.Text`
    color: #FF7F50;
`;

export const ErrorText = styled.Text`
    color: #666;
    font-style: italic;
    margin-bottom: 15px;
    margin-top: 2px;
`;

// Additional styles you might need
export const JobListContainer = styled.FlatList`
    margin-vertical: 10px;
`;

export const JobItem = styled.View`
    background-color: ${secondary};
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 10px;
`;

export const JobTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${tertiary};
`;

export const JobCompany = styled.Text`
    font-size: 14px;
    color: ${darkLight};
    margin-top: 5px;
`;