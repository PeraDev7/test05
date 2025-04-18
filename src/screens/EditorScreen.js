import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import WYSIWYGEditor from '../components/WYSIWYGEditor';
import WebsitePreview from '../components/WebsitePreview';

const EditorScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { websiteCode } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState('html'); // 'html', 'css', 'js'
  const [editedCode, setEditedCode] = useState({
    html: websiteCode.html || '',
    css: websiteCode.css || '',
    js: websiteCode.js || '',
  });

  const handleCodeChange = (code) => {
    setEditedCode(prev => ({
      ...prev,
      [editMode]: code
    }));
  };

  const handleSave = () => {
    navigation.navigate('Preview', { websiteCode: editedCode });
  };

  const renderTabButton = (mode, label, icon) => (
    <TouchableOpacity
      style={[styles.tabButton, editMode === mode && styles.activeTabButton]}
      onPress={() => setEditMode(mode)}
    >
      <Feather name={icon} size={18} color={editMode === mode ? '#fff' : '#adb5bd'} />
      <Text style={[styles.tabText, editMode === mode && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('editor')}</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Feather name="check" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {error && (
        <Animatable.Text animation="shake" style={styles.errorText}>
          {error}
        </Animatable.Text>
      )}

      <View style={styles.tabsContainer}>
        {renderTabButton('html', 'HTML', 'code')}
        {renderTabButton('css', 'CSS', 'layout')}
        {renderTabButton('js', 'JS', 'settings')}
      </View>

      <View style={styles.editorContainer}>
        <WYSIWYGEditor
          code={editedCode[editMode]}
          language={editMode}
          onChange={handleCodeChange}
        />
      </View>

      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>{t('livePreview')}</Text>
        <WebsitePreview websiteCode={editedCode} />
      </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff6b6b',
    marginHorizontal: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#6f7bf7',
  },
  tabText: {
    color: '#adb5bd',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#fff',
  },
  editorContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewContainer: {
    flex: 1,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 16,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditorScreen;
