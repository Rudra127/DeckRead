import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import BookDeck from '../components/BookDeck';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import useAuthGuard from '../hooks/useAuthGuard';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  useAuthGuard();
  const { books } = useAppContext();
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  
  const verticalFeedRef = useRef<FlatList<any>>(null);

  const onVerticalScrollEnd = ({ nativeEvent }: any) => {
    const newIndex = Math.round(nativeEvent.contentOffset.y / height);
    if (newIndex !== currentBookIndex) {
      setCurrentBookIndex(newIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <FlatList
        ref={verticalFeedRef}
        data={books}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <BookDeck book={item} />}
        onMomentumScrollEnd={onVerticalScrollEnd}
      />
      
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  mainContent: {
    flex: 1,
  },
});