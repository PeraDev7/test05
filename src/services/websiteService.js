import { db, storage, auth } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

// Save a new website project
export const saveProject = async (websiteCode) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const projectData = {
      name: `Website ${new Date().toLocaleDateString()}`,
      code: websiteCode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: user.uid,
    };
    
    const docRef = await addDoc(collection(db, 'projects'), projectData);
    return {
      id: docRef.id,
      ...projectData,
    };
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

// Get all projects for the current user
export const getUserProjects = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const projectsQuery = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(projectsQuery);
    
    const projects = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firebase timestamp to JS Date
      const createdAt = data.createdAt ? data.createdAt.toDate() : new Date();
      const updatedAt = data.updatedAt ? data.updatedAt.toDate() : new Date();
      
      projects.push({
        id: doc.id,
        ...data,
        createdAt,
        updatedAt,
      });
    });
    
    // Sort by creation date (newest first)
    return projects.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting user projects:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (projectId, websiteCode, name) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      throw new Error('Project not found');
    }
    
    const projectData = projectSnap.data();
    
    // Check if the project belongs to the current user
    if (projectData.userId !== user.uid) {
      throw new Error('Unauthorized access to project');
    }
    
    const updateData = {
      updatedAt: serverTimestamp(),
    };
    
    if (websiteCode) {
      updateData.code = websiteCode;
    }
    
    if (name) {
      updateData.name = name;
    }
    
    await updateDoc(projectRef, updateData);
    
    return {
      id: projectId,
      ...projectData,
      ...updateData,
    };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      throw new Error('Project not found');
    }
    
    const projectData = projectSnap.data();
    
    // Check if the project belongs to the current user
    if (projectData.userId !== user.uid) {
      throw new Error('Unauthorized access to project');
    }
    
    await deleteDoc(projectRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Duplicate a project
export const duplicateProject = async (project) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const duplicatedProjectData = {
      name: `${project.name} (Copy)`,
      code: project.code,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: user.uid,
    };
    
    const docRef = await addDoc(collection(db, 'projects'), duplicatedProjectData);
    
    return {
      id: docRef.id,
      ...duplicatedProjectData,
    };
  } catch (error) {
    console.error('Error duplicating project:', error);
    throw error;
  }
};
