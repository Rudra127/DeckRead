import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { mockBooks, mockUser, Book, User, BookCard } from '../data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http, ApiError } from '../services/http';

interface AppContextType {
  books: Book[];
  currentUser: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
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
  refreshCurrentUser: () => Promise<void>;
  // No direct call needed from UI – handled automatically when Clerk OAuth sign-in succeeds
  // loginWithOAuth?: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ────────────────────────────────────────────────────────────
  // Clerk hooks – we watch for social-login sessions
  // ────────────────────────────────────────────────────────────
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();

  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
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

  // ────────────────────────────────────────────────────────────
  // Handle fresh Clerk OAuth sign-in (Google / Apple / etc.)
  // Whenever Clerk reports `isSignedIn` but we haven't obtained our
  // own JWT yet, call the backend OAuth endpoint to retrieve one.
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    const exchangeClerkOAuthToken = async () => {
      if (!isSignedIn || isAuthenticated) return;
      
      try {
        setAuthLoading(true);
        
        const email = clerkUser?.primaryEmailAddress?.emailAddress;
        const userName = clerkUser?.username || clerkUser?.firstName || email?.split('@')[0] || 'clerkUser';
        
        if (!email) {
          console.warn('Clerk user missing email – cannot complete OAuth sign-in');
          return;
        }
        
        // Hit backend OAuth endpoint – expects email/userName and returns JWT
        const oauthRes = await http<{ token: string; message?: string }>(
          'POST',
          '/api/v1/auth/OAuth-signIn',
          { email, userName },
          false
        );
        
        const backendToken = (oauthRes as any).token || (oauthRes as any).data?.token;
        if (!backendToken) {
          console.error('Backend did not return a JWT for OAuth sign-in. Response:', oauthRes);
          return;
        }
        
        await AsyncStorage.setItem('token', backendToken);
        await refreshCurrentUser();
      } catch (err) {
        console.error('❌ Clerk OAuth exchange failed:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    
    exchangeClerkOAuthToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      console.log('🔐 Starting login process...');
      
      const loginRes = await http<{ token: string; message: string }>(
        'POST',
        '/api/v1/auth/login',
        { email, password },
        false,
      );
      
      console.log('📥 Login response received:', loginRes);
      
      // Extract token - check both possible structures
      let token;
      if (loginRes.data && loginRes.data.token) {
        token = loginRes.data.token;
        console.log('🎯 Token found in loginRes.data.token');
      } else if (loginRes.token) {
        token = loginRes.token;
        console.log('🎯 Token found in loginRes.token');
      } else {
        console.error('❌ Token structure:', loginRes);
        throw new Error('Token not found in response');
      }
      
      console.log('✅ Extracted token:', token.substring(0, 20) + '...');
      console.log('🔍 Token type:', typeof token);
      
      await AsyncStorage.setItem('token', token);
      console.log('💾 Token stored in AsyncStorage');
      
      // Fetch current user immediately
      console.log('👤 Fetching current user...');
      await refreshCurrentUser();
      
    } catch (err) {
      console.error('❌ Login failed:', (err as ApiError).message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setAuthLoading(true);
    try {
      console.log('📝 Starting registration process...');
      
      const registerRes = await http<{ token: string; message: string }>(
        'POST',
        '/api/v1/auth/register',
        { userName: username, email, password },
        false,
      );
      
      console.log('📥 Register response received:', registerRes);
      
      // Extract token - same logic as login
      let token;
      if (registerRes.data && registerRes.data.token) {
        token = registerRes.data.token;
      } else if (registerRes.token) {
        token = registerRes.token;
      } else {
        throw new Error('Token not found in response');
      }
      
      console.log('✅ Registration token extracted');
      await AsyncStorage.setItem('token', token);
      await refreshCurrentUser();
      
    } catch (err) {
      console.error('❌ Registration failed:', (err as ApiError).message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out...');
    await AsyncStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const refreshCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('🔍 Checking stored token:', token ? 'EXISTS' : 'MISSING');
      
      if (!token) {
        console.log('❌ No token found, clearing auth state');
        setCurrentUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      console.log('🚀 Making /auth/me request...');
      console.log('🔑 Using token:', token.substring(0, 20) + '...');
      
      try {
        // First, let's try to get the raw response to see what's actually being returned
        console.log('📡 Attempting HTTP request...');
        
        // Make the API call - GET request with headers only
        const response = await http<{ user: User }>('GET', '/api/v1/auth/me', null, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
        
        console.log('📥 Raw response received (first 200 chars):', JSON.stringify(response).substring(0, 200));
        console.log('📊 Response type:', typeof response);
        console.log('🔍 Response keys:', Object.keys(response || {}));
        
        // Extract user from response
        let user;
        if (response.data && response.data.user) {
          user = response.data.user;
          console.log('✅ User found in response.data.user');
        } else if (response.user) {
          user = response.user;
          console.log('✅ User found in response.user');
        } else if (response.data) {
          // Maybe the user is directly in data
          user = response.data;
          console.log('✅ User found directly in response.data');
        } else {
          console.log('❌ User not found. Full response structure:', response);
          throw new Error('User not found in response');
        }
        
        console.log('✅ User data extracted:', user);
        setCurrentUser(user);
        setIsAuthenticated(true);
        
      } catch (httpError: any) {
        console.error('🔥 HTTP Error details:');
        console.error('- Message:', httpError.message);
        console.error('- Status:', httpError.status || 'unknown');
        
        // Let's also check what your protect middleware might be doing
        console.error('🛡️ MIDDLEWARE DEBUG CHECKLIST:');
        console.error('1. Is your protect middleware working correctly?');
        console.error('2. Is req.user being set properly by protect middleware?');
        console.error('3. Is your service.Me() function working?');
        console.error('4. Check your server logs for any errors');
        
        // Check if it's an HTML response (server error)
        if (httpError.message && httpError.message.includes('DOCTYPE')) {
          console.error('💥 Server returned HTML - this means:');
          console.error('   ❌ Your backend is hitting an error and returning an error page');
          console.error('   ❌ The protect middleware might be failing');
          console.error('   ❌ The service.Me() function might be throwing an error');
          console.error('   ❌ Check your backend console for error logs');
        }
        
        throw httpError;
      }
      
    } catch (error) {
      console.error('❌ /auth/me failed:', error);
      console.log('🧹 Clearing invalid token...');
      await AsyncStorage.removeItem('token');
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  // Fetch current user on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🚀 App initializing - checking for existing token...');
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          console.log('❌ No existing token found');
          setAuthLoading(false);
          return;
        }
        
        console.log('✅ Existing token found, validating...');
        
        // Make the API call to validate token and get user - GET request with headers only
        const response = await http<{ user: User }>('GET', '/api/v1/auth/me', null, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
        
        console.log('📥 Initial /auth/me response:', response);
        
        // Extract user from response
        let user;
        if (response.data && response.data.user) {
          user = response.data.user;
        } else if (response.user) {
          user = response.user;
        } else {
          throw new Error('User not found in response');
        }
        
        console.log('✅ Initial auth successful, user:', user);
        setCurrentUser(user);
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error('❌ Initial auth failed:', error);
        await AsyncStorage.removeItem('token');
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  return (
    <AppContext.Provider
      value={{
        books,
        currentUser,
        isAuthenticated,
        authLoading,
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
        refreshCurrentUser,
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