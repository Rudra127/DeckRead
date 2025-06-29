import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
  
  // Choose gradient based on index for variety
  const gradients = [
    ["#FFEECC", "#FFE4F0"],
    ["#D8ECFF", "#E6E9FF"],
    ["#FEE4D4", "#FFE8F0"]
  ];
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients[currentCardIndex % gradients.length]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.contentCard}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardNumber}>
            {currentCardIndex + 1} / {book.cards.length}
          </Text>
        </View>
        
        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>{card.content}</Text>
        </View>
        
        {/* Action Row */}
        <BlurView intensity={30} tint="light" style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onComment}>
            <Feather name="message-circle" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Feather name="share" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleSaveBook(book.id)}
          >
            <Feather
              name={isSaved ? "bookmark" : "bookmark"}
              size={22}
              color={isSaved ? "#4A6FFF" : "#333"}
            />
          </TouchableOpacity>
        </BlurView>
        
        {/* Footer */}
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
        </View>
      </LinearGradient>
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
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 32,
    overflow: 'hidden',
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 28,
    lineHeight: 38,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
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