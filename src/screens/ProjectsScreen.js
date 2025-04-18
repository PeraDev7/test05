import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { getUserProjects, deleteProject, duplicateProject } from '../services/websiteService';

const ProjectsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
    
    // Refresh projects when focusing the screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadProjects();
    });

    return unsubscribe;
  }, [navigation]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userProjects = await getUserProjects();
      setProjects(userProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError(t('projectsLoadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigation.navigate('Create');
  };

  const handleViewProject = (project) => {
    navigation.navigate('Preview', { websiteCode: project.code });
  };

  const handleEditProject = (project) => {
    navigation.navigate('Editor', { websiteCode: project.code });
  };

  const handleDeleteProject = async (projectId) => {
    try {
      setLoading(true);
      await deleteProject(projectId);
      
      // Refresh projects
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting project:', error);
      setError(t('deleteProjectError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateProject = async (project) => {
    try {
      setLoading(true);
      const newProject = await duplicateProject(project);
      
      // Refresh projects
      setProjects([...projects, newProject]);
    } catch (error) {
      console.error('Error duplicating project:', error);
      setError(t('duplicateProjectError'));
    } finally {
      setLoading(false);
    }
  };

  const renderProjectItem = ({ item }) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={500} 
      style={styles.projectCard}
    >
      <TouchableOpacity 
        style={styles.projectCardContent}
        onPress={() => handleViewProject(item)}
      >
        <View style={styles.projectImagePlaceholder}>
          <Feather name="globe" size={24} color="#6f7bf7" />
        </View>
        
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <Text style={styles.projectDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.projectActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditProject(item)}
        >
          <Feather name="edit-2" size={20} color="#6f7bf7" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDuplicateProject(item)}
        >
          <Feather name="copy" size={20} color="#6f7bf7" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteProject(item.id)}
        >
          <Feather name="trash-2" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  const renderEmptyProjects = () => (
    <View style={styles.emptyContainer}>
      <Feather name="file-text" size={50} color="rgba(255, 255, 255, 0.3)" />
      <Text style={styles.emptyText}>{t('noProjects')}</Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateNew}
      >
        <Text style={styles.createButtonText}>{t('createFirst')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('myProjects')}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateNew}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {error && (
        <Animatable.Text animation="shake" style={styles.errorText}>
          {error}
        </Animatable.Text>
      )}

      {loading && !projects.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6f7bf7" />
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.projectList}
          ListEmptyComponent={renderEmptyProjects}
        />
      )}

      {loading && projects.length > 0 && (
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
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#6f7bf7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    marginHorizontal: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectList: {
    padding: 15,
  },
  projectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  projectCardContent: {
    flexDirection: 'row',
    padding: 15,
  },
  projectImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(111, 123, 247, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  projectName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  projectDate: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  projectActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#6f7bf7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProjectsScreen;
