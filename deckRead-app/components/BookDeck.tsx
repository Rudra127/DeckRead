import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import BookCard from './BookCard';
import ShareQuoteModal from './ShareQuoteModal';

import { Book } from '../data/mockData';
import { generateSummaryCards } from '../services/gemini';

interface Props {
  book: Book;
}

const { width } = Dimensions.get('window');

const BookDeck: React.FC<Props> = ({ book }) => {
  const { cardPreference } = useAppContext();
  const scrollRef = useRef<ScrollView>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const visibleCards = cardPreference === 1 ? 1 : cardPreference === 3 ? 3 : 5;
  const [cards, setCards] = useState(book.cards);
  const cardsToRender = cards.slice(0, visibleCards);

  useEffect(() => {
    if (cardsToRender.length < visibleCards) {
      // Fetch extra cards
      (async () => {
        const additional = await generateSummaryCards(book.title, cards[0]?.content ?? '', visibleCards - cardsToRender.length);
        setCards(prev => [...prev, ...additional]);
      })();
    }
  }, [visibleCards]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIdx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCardIndex(newIdx);
        }}
      >
        {cardsToRender.map((card, idx) => (
          <BookCard
            key={card.id}
            book={book}
            currentCardIndex={idx}
            onShare={() => setShareModalVisible(true)}
            onComment={() => {}}
          />
        ))}
      </ScrollView>
      {cardsToRender[cardIndex] && (
        <ShareQuoteModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          bookId={book.id}
          cardId={cardsToRender[cardIndex]?.id}
          quoteContent={cardsToRender[cardIndex]?.content}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    justifyContent: 'center',
  },
});

export default BookDeck;