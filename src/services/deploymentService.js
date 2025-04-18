import { Platform } from 'react-native';
import axios from 'axios';
import { auth } from '../config/firebase';
import Constants from 'expo-constants';

// API endpoints for different deployment services
const NETLIFY_API = 'https://api.netlify.com/api/v1';
const VERCEL_API = 'https://api.vercel.com';

// Get API keys from environment variables or constants
const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN || Constants.manifest.extra?.netlifyToken;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || Constants.manifest.extra?.vercelToken;

// Deploy website to Netlify
const deployToNetlify = async (websiteCode) => {
  try {
    if (!NETLIFY_TOKEN) {
      throw new Error('Netlify API token is missing');
    }
    
    // Generate a zip file in-memory (using JSZip or similar library)
    const { generateZipFile } = await import('../utils/fileUtils');
    const zipBlob = await generateZipFile(websiteCode);
    
    // Create a FormData object to send the zip file
    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'android' ? zipBlob.uri : zipBlob.uri.replace('file://', ''),
      name: 'site.zip',
      type: 'application/zip',
    });
    
    // Deploy to Netlify
    const response = await axios.post(
      `${NETLIFY_API}/sites`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        },
      }
    );
    
    return response.data.url;
  } catch (error) {
    console.error('Error deploying to Netlify:', error);
    throw new Error(`Netlify deployment failed: ${error.message}`);
  }
};

// Deploy website to Vercel
const deployToVercel = async (websiteCode) => {
  try {
    if (!VERCEL_TOKEN) {
      throw new Error('Vercel API token is missing');
    }
    
    // Create a deployment
    const response = await axios.post(
      `${VERCEL_API}/v12/deployments`,
      {
        name: `webgenie-${Date.now()}`,
        files: [
          {
            file: 'index.html',
            data: websiteCode.html,
          },
          {
            file: 'styles.css',
            data: websiteCode.css,
          },
          {
            file: 'script.js',
            data: websiteCode.js,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.url;
  } catch (error) {
    console.error('Error deploying to Vercel:', error);
    throw new Error(`Vercel deployment failed: ${error.message}`);
  }
};

// Main deployment function that tries different services
export const deployWebsite = async (websiteCode) => {
  // Get user for deployment naming
  const user = auth.currentUser;
  const userId = user ? user.uid.substring(0, 8) : 'anonymous';
  
  try {
    // Try Netlify first
    try {
      return await deployToNetlify(websiteCode);
    } catch (netlifyError) {
      console.log('Netlify deployment failed, trying Vercel...');
    }
    
    // Try Vercel as fallback
    try {
      return await deployToVercel(websiteCode);
    } catch (vercelError) {
      throw new Error('All deployment methods failed');
    }
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
};
