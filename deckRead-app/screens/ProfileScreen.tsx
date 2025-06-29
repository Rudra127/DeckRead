import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  FlatList,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import useAuthGuard from '../hooks/useAuthGuard';

export default function ProfileScreen() {
  useAuthGuard();
  const { currentUser, books, savedBooks, logout, cardPreference, setCardPreference } = useAppContext();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'quotes'
  
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Profile" showBackButton={true} showProfileButton={false} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Sign in to view your profile</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register' as never)}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const savedBooksList = books.filter(book => savedBooks.includes(book.id));
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" showBackButton={true} showProfileButton={false} />
      
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: currentUser.profilePicture }} 
              style={styles.profileImage} 
            />
            {currentUser.quotes.length > 0 && (
              <View style={styles.storyRing} />
            )}
          </View>
          
          <Text style={styles.username}>{currentUser.username}</Text>
          <Text style={styles.bio}>{currentUser.bio}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{savedBooks.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]} 
            onPress={() => setActiveTab('saved')}
          >
            <Feather 
              name="bookmark" 
              size={20} 
              color={activeTab === 'saved' ? "#4A6FFF" : "#888"} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'saved' && styles.activeTabText
              ]}
            >
              Saved Books
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'quotes' && styles.activeTab]} 
            onPress={() => setActiveTab('quotes')}
          >
            <Feather 
              name="message-square" 
              size={20} 
              color={activeTab === 'quotes' ? "#4A6FFF" : "#888"} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'quotes' && styles.activeTabText
              ]}
            >
              Quotes
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'saved' ? (
          <View style={styles.savedBooksContainer}>
            {savedBooksList.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="bookmark" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  No saved books yet
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => navigation.navigate('Home' as never)}
                >
                  <Text style={styles.emptyStateButtonText}>
                    Discover Books
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                key="saved-grid"
                data={savedBooksList}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.bookCard}
                    onPress={() => {
                      // Navigate to book detail or open in feed
                      navigation.navigate('Home' as never);
                    }}
                  >
                    <Image 
                      source={{ uri: item.coverImage }} 
                      style={styles.bookCover} 
                    />
                    <Text style={styles.bookTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.bookAuthor} numberOfLines={1}>
                      {item.author}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        ) : (
          <View style={styles.quotesContainer}>
            {currentUser.quotes.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="message-square" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  No quotes shared yet
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => navigation.navigate('Home' as never)}
                >
                  <Text style={styles.emptyStateButtonText}>
                    Find Quotes to Share
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                key="quotes-list"
                data={currentUser.quotes}
                numColumns={1}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const book = books.find(b => b.id === item.bookId);
                  return (
                    <View style={styles.quoteCard}>
                      <View style={styles.quoteHeader}>
                        <Image 
                          source={{ uri: book?.coverImage }} 
                          style={styles.quoteBookCover} 
                        />
                        <View>
                          <Text style={styles.quoteBookTitle}>
                            {book?.title}
                          </Text>
                          <Text style={styles.quoteBookAuthor}>
                            {book?.author}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.quoteContent}>
                        "{item.content}"
                      </Text>
                      <Text style={styles.quoteTimestamp}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  );
                }}
              />
            )}
          </View>
        )}
        
        <View style={styles.cardPrefContainer}>
          {[1,3,5].map(num => (
            <TouchableOpacity
              key={num}
              style={[styles.prefButton, cardPreference===num && styles.prefButtonActive]}
              onPress={()=>setCardPreference(num)}
            >
              <Text style={[styles.prefButtonText, cardPreference===num && styles.prefButtonTextActive]}>
                {num} Card{num>1?'s':''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  storyRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: '#4A6FFF',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardPrefContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  prefButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 6,
  },
  prefButtonActive: {
    backgroundColor: '#4A6FFF',
    borderColor: '#4A6FFF',
  },
  prefButtonText: {
    fontSize: 14,
    color: '#666',
  },
  prefButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A6FFF',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#4A6FFF',
    fontWeight: '600',
  },
  savedBooksContainer: {
    padding: 16,
    minHeight: 300,
  },
  quotesContainer: {
    padding: 16,
    minHeight: 300,
  },
  bookCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookCover: {
    width: '100%',
    height: 180,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginHorizontal: 8,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginHorizontal: 8,
  },
  quoteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quoteBookCover: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  quoteBookTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  quoteBookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  quoteContent: {
    fontSize: 18,
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  quoteTimestamp: {
    fontSize: 14,
    color: '#888',
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#4A6FFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#4A6FFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    width: '80%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A6FFF',
    width: '80%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#4A6FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginVertical: 24,
    marginHorizontal: 16,
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 16,
  },
});