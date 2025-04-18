import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

import GradientBackground from '../components/GradientBackground';
import CircularGraphic from '../components/CircularGraphic';
import SocialLoginButton from '../components/SocialLoginButton';
import { signInWithApple, signInWithFacebook, signInWithGoogle } from '../services/authService';

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      setError(null);
      
      switch (provider) {
        case 'apple':
          await signInWithApple();
          break;
        case 'facebook':
          await signInWithFacebook();
          break;
        case 'google':
          await signInWithGoogle();
          break;
        default:
          throw new Error('Invalid provider');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <Animatable.View 
          animation="fadeIn" 
          duration={1000} 
          style={styles.contentContainer}
        >
          <Text style={styles.startText}>{t('letsStart')}</Text>
          
          <Animatable.Text 
            animation="fadeInUp" 
            delay={300} 
            style={styles.welcomeText}
          >
            {t('welcomeTo')}
          </Animatable.Text>
          
          <Animatable.Text 
            animation="fadeInUp" 
            delay={500} 
            style={styles.appNameText}
          >
            WebGenie
          </Animatable.Text>
          
          <Animatable.Text 
            animation="fadeInUp" 
            delay={700} 
            style={styles.descriptionText}
          >
            {t('appDescription')}
          </Animatable.Text>
          
          <Animatable.View 
            animation="fadeIn" 
            delay={900} 
            style={styles.graphicContainer}
          >
            <CircularGraphic />
          </Animatable.View>
          
          {error && (
            <Animatable.Text 
              animation="shake" 
              style={styles.errorText}
            >
              {error}
            </Animatable.Text>
          )}
          
          <Animatable.View 
            animation="fadeInUp" 
            delay={1100} 
            style={styles.buttonsContainer}
          >
            <SocialLoginButton 
              provider="apple"
              onPress={() => handleSocialLogin('apple')}
              disabled={loading}
            />
            
            <SocialLoginButton 
              provider="facebook"
              onPress={() => handleSocialLogin('facebook')}
              disabled={loading}
            />
            
            <SocialLoginButton 
              provider="google"
              onPress={() => handleSocialLogin('google')}
              disabled={loading}
            />
          </Animatable.View>
          
          {loading && (
            <ActivityIndicator 
              size="large" 
              color="#fff" 
              style={styles.loadingIndicator} 
            />
          )}
        </Animatable.View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  startText: {
    color: '#6f7bf7',
    fontSize: 18,
    marginBottom: 8,
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },
  appNameText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  graphicContainer: {
    marginBottom: 50,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default WelcomeScreen;
