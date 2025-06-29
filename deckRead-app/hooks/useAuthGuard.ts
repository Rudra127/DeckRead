import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Ensures the user session is still valid whenever a screen gains focus.
 * If the JWT is missing / invalid the user is redirected to the Login stack.
 */
export default function useAuthGuard() {
  const { refreshCurrentUser, isAuthenticated } = useAppContext();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        await refreshCurrentUser();
        if (isActive && !isAuthenticated) {
          // Force navigation to Login screen (reset stack)
          navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
        }
      })();
      return () => {
        isActive = false;
      };
    }, [isAuthenticated])
  );
}