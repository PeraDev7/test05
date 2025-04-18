import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { getUserProfile, updateUserSettings } from '../services/authService';

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    autoSave: true,
    language: i18n.language,
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        
        // Load user settings
        if (userProfile.settings) {
          setSettings(prev => ({
            ...prev,
            ...userProfile.settings,
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError(t('profileLoadError'));
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(t('signOutError'));
      setLoading(false);
    }
  };

  const handleToggleSetting = async (setting) => {
    try {
      const newSettings = {
        ...settings,
        [setting]: !settings[setting],
      };
      
      setSettings(newSettings);
      await updateUserSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      setError(t('settingsUpdateError'));
    }
  };

  const handleChangeLanguage = async (lang) => {
    try {
      // Change app language
      i18n.changeLanguage(lang);
      
      // Update user settings
      const newSettings = {
        ...settings,
        language: lang,
      };
      
      setSettings(newSettings);
      await updateUserSettings(newSettings);
    } catch (error) {
      console.error('Error changing language:', error);
      setError(t('languageChangeError'));
    }
  };

  const handleResetSettings = async () => {
    try {
      const defaultSettings = {
        autoSave: true,
        language: 'en',
      };
      
      setSettings(defaultSettings);
      await updateUserSettings(defaultSettings);
      
      // Change app language to default
      i18n.changeLanguage('en');
    } catch (error) {
      console.error('Error resetting settings:', error);
      setError(t('resetSettingsError'));
    }
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6f7bf7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View 
        animation="fadeIn" 
        duration={800} 
        style={styles.header}
      >
        <Text style={styles.headerText}>{t('profileOptions')}</Text>
      </Animatable.View>

      <ScrollView style={styles.scrollView}>
        {error && (
          <Animatable.Text animation="shake" style={styles.errorText}>
            {error}
          </Animatable.Text>
        )}

        <Animatable.View 
          animation="fadeInUp" 
          delay={200} 
          style={styles.profileSection}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Feather name="user" size={40} color="#6f7bf7" />
            </View>
          </View>
          
          <Text style={styles.userName}>{profile?.displayName || t('user')}</Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
          
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileButtonText}>{t('myProfile')}</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View 
          animation="fadeInUp" 
          delay={400} 
          style={styles.settingsSection}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Feather name="credit-card" size={24} color="#6f7bf7" />
            </View>
            <Text style={styles.settingText}>{t('subscriptionManagement')}</Text>
            <Feather name="chevron-right" size={24} color="#adb5bd" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Feather name="save" size={24} color="#6f7bf7" />
            </View>
            <Text style={styles.settingText}>{t('autoSave')}</Text>
            <Switch
              value={settings.autoSave}
              onValueChange={() => handleToggleSetting('autoSave')}
              trackColor={{ false: "#3e3e5e", true: "#6f7bf7" }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleResetSettings}
          >
            <View style={styles.settingIconContainer}>
              <Feather name="refresh-cw" size={24} color="#6f7bf7" />
            </View>
            <Text style={styles.settingText}>{t('resetSettings')}</Text>
            <Text style={styles.resetText}>{t('reset')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Feather name="file-text" size={24} color="#6f7bf7" />
            </View>
            <Text style={styles.settingText}>{t('termsOfService')}</Text>
            <Feather name="chevron-right" size={24} color="#adb5bd" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Feather name="shield" size={24} color="#6f7bf7" />
            </View>
            <Text style={styles.settingText}>{t('privacyPolicy')}</Text>
            <Feather name="chevron-right" size={24} color="#adb5bd" />
          </TouchableOpacity>

          <View style={styles.appVersionContainer}>
            <Text style={styles.appName}>WebGenie</Text>
            <Text style={styles.appVersion}>4.7.3 (224)</Text>
          </View>
        </Animatable.View>

        <Animatable.View 
          animation="fadeInUp" 
          delay={600} 
          style={styles.languageSection}
        >
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              settings.language === 'en' && styles.selectedLanguage
            ]}
            onPress={() => handleChangeLanguage('en')}
          >
            <Text style={[
              styles.languageText,
              settings.language === 'en' && styles.selectedLanguageText
            ]}>English</Text>
            {settings.language === 'en' && (
              <Feather name="check" size={20} color="#6f7bf7" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              settings.language === 'it' && styles.selectedLanguage
            ]}
            onPress={() => handleChangeLanguage('it')}
          >
            <Text style={[
              styles.languageText,
              settings.language === 'it' && styles.selectedLanguageText
            ]}>Italiano</Text>
            {settings.language === 'it' && (
              <Feather name="check" size={20} color="#6f7bf7" />
            )}
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View 
          animation="fadeInUp" 
          delay={800} 
          style={styles.logoutContainer}
        >
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6f7bf7" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  errorText: {
    color: '#ff6b6b',
    marginHorizontal: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 15,
  },
  profileButton: {
    backgroundColor: '#4a4fdb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    color: '#fff',
    flex: 1,
  },
  resetText: {
    color: '#6f7bf7',
  },
  appVersionContainer: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    color: '#fff',
  },
  appVersion: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  languageSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    color: '#6f7bf7',
    fontSize: 16,
    marginBottom: 10,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedLanguage: {
    backgroundColor: 'rgba(111, 123, 247, 0.1)',
  },
  languageText: {
    color: '#fff',
  },
  selectedLanguageText: {
    color: '#6f7bf7',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 10,
  },
  logoutText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
