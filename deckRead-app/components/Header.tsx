import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showProfileButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'DeckRead', 
  showBackButton = false,
  showProfileButton = true
}) => {
  const navigation = useNavigation();
  let currentUser: any = null;
  try {
    currentUser = useAppContext().currentUser;
  } catch {
    currentUser = null;
  }
  
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Home' as never)}
          >
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {showProfileButton && currentUser && (
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile' as never)}
        >
          <Image 
            source={{ uri: currentUser.profilePicture }} 
            style={styles.profileImage} 
          />
          {currentUser.quotes.length > 0 && (
            <View style={styles.storyRing} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  storyRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4A6FFF',
  },
});

export default Header;