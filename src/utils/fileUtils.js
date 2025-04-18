import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import JSZip from 'jszip';

// Generate a ZIP file from website code
export const generateZipFile = async (websiteCode) => {
  try {
    const { html, css, js } = websiteCode;
    
    // Create a new JSZip instance
    const zip = new JSZip();
    
    // Add files to the zip
    zip.file('index.html', html || '');
    zip.file('styles.css', css || '');
    zip.file('script.js', js || '');
    
    // Generate zip content
    const zipContent = await zip.generateAsync({
      type: 'base64',
    });
    
    // Save zip file to temporary directory
    const fileName = `website_${Date.now()}.zip`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, zipContent, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return {
      uri: fileUri,
      name: fileName,
      type: 'application/zip',
    };
  } catch (error) {
    console.error('Error generating zip file:', error);
    throw error;
  }
};

// Export website as ZIP file
export const exportWebsiteAsZip = async (websiteCode) => {
  try {
    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    
    if (!isSharingAvailable) {
      throw new Error('Sharing is not available on this device');
    }
    
    // Generate zip file
    const zipFile = await generateZipFile(websiteCode);
    
    // Share the file
    await Sharing.shareAsync(zipFile.uri, {
      mimeType: 'application/zip',
      dialogTitle: 'Export Website',
      UTI: 'com.pkware.zip-archive',
    });
    
    return true;
  } catch (error) {
    console.error('Error exporting website:', error);
    throw error;
  }
};
