import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const BottomNavBar: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const isActive = (screenName: string) => {
    return route.name === screenName;
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Feather 
          name="book-open" 
          size={24} 
          color={isActive('Home') ? '#4A6FFF' : '#888'} 
        />
        <Text style={[styles.tabText, isActive('Home') && styles.activeTabText]}>
          Books
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => navigation.navigate('Search' as never)}
      >
        <Feather 
          name="search" 
          size={24} 
          color={isActive('Search') ? '#4A6FFF' : '#888'} 
        />
        <Text style={[styles.tabText, isActive('Search') && styles.activeTabText]}>
          Search
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => navigation.navigate('Profile' as never)}
      >
        <Feather 
          name="user" 
          size={24} 
          color={isActive('Profile') ? '#4A6FFF' : '#888'} 
        />
        <Text style={[styles.tabText, isActive('Profile') && styles.activeTabText]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 10,
    paddingBottom: 25, // Extra padding for bottom safe area
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
  activeTabText: {
    color: '#4A6FFF',
    fontWeight: '600',
  },
});

export default BottomNavBar;