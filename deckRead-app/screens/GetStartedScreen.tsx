import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useOAuth } from '@clerk/clerk-expo';

export default function GetStartedScreen() {
  // We default to Google OAuth. Clerk will create an account on first sign-in.
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleGetStarted = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, [startOAuthFlow]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        // Animated like gradient (static for now but vibrant)
        colors={["#4A6FFF", "#5D58FF", "#8E46FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Image
            source={{ uri: 'https://api.a0.dev/assets/image?text=Modern%20Bookshelf&aspect=1:1&seed=getstarted' }}
            style={styles.heroImage}
          />
          <Text style={styles.title}>DeckRead</Text>
          <Text style={styles.subtitle}>Bite-sized book insights that spark aha! moments</Text>

          <TouchableOpacity activeOpacity={0.9} style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  heroImage: {
    width: 180,
    height: 180,
    marginBottom: 40,
    borderRadius: 36,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 56,
    textAlign: 'center',
    lineHeight: 26,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 56,
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});