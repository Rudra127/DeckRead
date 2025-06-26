import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockBooks, mockUser, Book, User, BookCard } from '../data/mockData';

interface AppContextType {
  books: Book[];
  currentUser: User | null;
  isAuthenticated: boolean;
  savedBooks: string[];
  toggleSaveBook: (bookId: string) => void;
  addQuote: (bookId: string, cardId: string, content: string) => void;
  cardPreference: number;
  setCardPreference: (count: number) => void;
  addBooks: (newBooks: Book[]) => void;
  updateBookCards: (bookId: string, cards: BookCard[]) => void;
  login: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUser); // For MVP, start with a logged-in user
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // For MVP, start authenticated
  const [savedBooks, setSavedBooks] = useState<string[]>(mockUser.savedBooks);
  const [cardPreference, setCardPreference] = useState<number>(5);

  const toggleSaveBook = (bookId: string) => {
    setSavedBooks(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };

  const addQuote = (bookId: string, cardId: string, content: string) => {
    if (!currentUser) return;
    
    const newQuote = {
      id: `q${Date.now()}`,
      bookId,
      cardId,
      content,
      createdAt: Date.now(),
    };
    
    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        quotes: [newQuote, ...prev.quotes]
      };
    });
  };

  const addBooks = (newBooks: Book[]) => {
    setBooks(prev => [...prev, ...newBooks]);
  };

  const updateBookCards = (bookId: string, cards: BookCard[]) => {
    setBooks(prev => prev.map(b => (b.id === bookId ? { ...b, cards } : b)));
  };

  // Mock authentication functions
  const login = (email: string, password: string) => {
    // In a real app, this would validate credentials against a backend
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
  };

  const register = (username: string, email: string, password: string) => {
    // In a real app, this would create a new user in the backend
    const newUser = {
      ...mockUser,
      username,
      email,
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        books,
        currentUser,
        isAuthenticated,
        savedBooks,
        toggleSaveBook,
        addQuote,
        cardPreference,
        setCardPreference,
        addBooks,
        updateBookCards,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};