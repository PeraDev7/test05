import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  OAuthProvider,
  GoogleAuthProvider, 
  FacebookAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import { auth, db, googleProvider, facebookProvider, appleProvider } from '../config/firebase';

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    if (Platform.OS === 'web') {
      // Web implementation
      return await signInWithPopup(auth, googleProvider);
    } else {
      // Mobile implementation using Expo
      const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.GOOGLE_CLIENT_ID,
        iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
      });
      
      const result = await promptAsync();
      
      if (result.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        return await auth.signInWithCredential(credential);
      } else {
        throw new Error('Google sign-in failed');
      }
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
  try {
    if (Platform.OS === 'web') {
      // Web implementation
      return await signInWithPopup(auth, facebookProvider);
    } else {
      // Mobile implementation using Expo
      const [request, response, promptAsync] = Facebook.useAuthRequest({
        clientId: process.env.FACEBOOK_APP_ID,
      });
      
      const result = await promptAsync();
      
      if (result.type === 'success') {
        const { access_token } = result.params;
        const credential = FacebookAuthProvider.credential(access_token);
        return await auth.signInWithCredential(credential);
      } else {
        throw new Error('Facebook sign-in failed');
      }
    }
  } catch (error) {
    console.error('Facebook sign-in error:', error);
    throw error;
  }
};

// Sign in with Apple
export const signInWithApple = async () => {
  try {
    if (Platform.OS === 'web') {
      // Web implementation
      return await signInWithPopup(auth, appleProvider);
    } else if (Platform.OS === 'ios') {
      // iOS implementation using Expo
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      // Convert Apple credential to Firebase credential
      const { identityToken } = credential;
      const provider = new OAuthProvider('apple.com');
      const oauthCredential = provider.credential({
        idToken: identityToken,
      });
      
      return await auth.signInWithCredential(oauthCredential);
    } else {
      throw new Error('Apple sign-in is not supported on this platform');
    }
  } catch (error) {
    console.error('Apple sign-in error:', error);
    throw error;
  }
};

// Get user profile information
export const getUserProfile = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if user document exists in firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      // Create new user profile if it doesn't exist
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        settings: {
          autoSave: true,
          language: 'en',
        },
      };
      
      await setDoc(userDocRef, userData);
      return userData;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user settings
export const updateUserSettings = async (settings) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { settings });
    
    return settings;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};
