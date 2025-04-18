import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const SocialLoginButton = ({ provider, onPress, disabled }) => {
  const { t } = useTranslation();
  
  // Configuration for different providers
  const providerConfig = {
    apple: {
      icon: 'apple',
      color: '#000',
      backgroundColor: '#fff',
      text: t('signInWithApple')
    },
    facebook: {
      icon: 'facebook',
      color: '#fff',
      backgroundColor: '#3b5998',
      text: t('signInWithFacebook')
    },
    google: {
      icon: 'mail',
      color: '#000',
      backgroundColor: '#fff',
      text: t('signInWithGoogle')
    }
  };
  
  const config = providerConfig[provider];
  
  if (!config) {
    return null;
  }
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: config.backgroundColor },
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {disabled ? (
        <ActivityIndicator size="small" color={config.color} />
      ) : (
        <>
          <Feather 
            name={config.icon} 
            size={20} 
            color={config.color} 
            style={styles.icon} 
          />
          <Text style={[styles.text, { color: config.color }]}>
            {config.text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
  },
  disabledButton: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SocialLoginButton;
