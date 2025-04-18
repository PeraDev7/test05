import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import WebsitePreview from '../components/WebsitePreview';
import { saveProject } from '../services/websiteService';
import { exportWebsiteAsZip } from '../utils/fileUtils';
import { deployWebsite } from '../services/deploymentService';

const PreviewScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { websiteCode } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deploymentUrl, setDeploymentUrl] = useState(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await saveProject(websiteCode);
      
      // Show success message
      alert(t('projectSaved'));
    } catch (error) {
      console.error('Error saving project:', error);
      setError(t('saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await exportWebsiteAsZip(websiteCode);
      
      // Show success message
      alert(t('exportSuccess'));
    } catch (error) {
      console.error('Error exporting website:', error);
      setError(t('exportError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = await deployWebsite(websiteCode);
      setDeploymentUrl(url);
      
      // Show success message
      alert(t('deploySuccess'));
    } catch (error) {
      console.error('Error deploying website:', error);
      setError(t('deployError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('Editor', { websiteCode });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('preview')}</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Feather name="save" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {error && (
        <Animatable.Text animation="shake" style={styles.errorText}>
          {error}
        </Animatable.Text>
      )}

      {deploymentUrl && (
        <View style={styles.deploymentInfo}>
          <Text style={styles.deploymentText}>{t('deployedAt')}:</Text>
          <Text style={styles.deploymentUrl}>{deploymentUrl}</Text>
        </View>
      )}

      <View style={styles.previewContainer}>
        <WebsitePreview websiteCode={websiteCode} />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleEdit}
          disabled={loading}
        >
          <Feather name="edit-2" size={20} color="#fff" />
          <Text style={styles.actionText}>{t('edit')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleExport}
          disabled={loading}
        >
          <Feather name="download" size={20} color="#fff" />
          <Text style={styles.actionText}>{t('export')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleDeploy}
          disabled={loading}
        >
          <Feather name="globe" size={20} color="#fff" />
          <Text style={styles.actionText}>{t('deploy')}</Text>
        </TouchableOpacity>
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
  previewContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    color: '#fff',
    marginTop: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deploymentInfo: {
    backgroundColor: 'rgba(111, 123, 247, 0.2)',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  deploymentText: {
    color: '#fff',
    fontSize: 14,
  },
  deploymentUrl: {
    color: '#6f7bf7',
    fontSize: 14,
    marginTop: 5,
  },
});

export default PreviewScreen;
