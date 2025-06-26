import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Book } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { Feather } from '@expo/vector-icons';

interface BookCardProps {
  book: Book;
  currentCardIndex: number;
  onShare: () => void;
  onComment: () => void;
}

const { width, height } = Dimensions.get('window');

const BookCard: React.FC<BookCardProps> = ({ book, currentCardIndex, onShare, onComment }) => {
  const { savedBooks, toggleSaveBook } = useAppContext();
  const isSaved = savedBooks.includes(book.id);
  const card = book.cards[currentCardIndex];
  
  return (
    <View style={styles.container}>
      <View style={styles.contentCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardNumber}>
            {currentCardIndex + 1} / {book.cards.length}
          </Text>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onComment}>
              <Feather name="message-circle" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onShare}>
              <Feather name="share-2" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleSaveBook(book.id)}
            >
              <Feather name="bookmark" size={20} color={isSaved ? "#4A6FFF" : "#666"} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>{card.content}</Text>
        </View>
        
        {/* Footer */}
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 22,
    lineHeight: 32,
    color: '#333',
    textAlign: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
});

export default BookCard;