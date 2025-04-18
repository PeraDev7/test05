import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';

const WebsitePreview = ({ websiteCode }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const webViewRef = useRef(null);

  // Combine HTML, CSS, and JS into a complete HTML document
  const generateCompleteHtml = () => {
    const { html, css, js } = websiteCode;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebGenie Preview</title>
        <style>
          ${css || ''}
        </style>
      </head>
      <body>
        ${html || '<div>No HTML content available</div>'}
        <script>
          ${js || ''}
        </script>
      </body>
      </html>
    `;
  };

  // Handle webview loading state
  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = (e) => {
    console.error('WebView error:', e);
    setError(t('previewError'));
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: generateCompleteHtml() }}
          style={styles.webView}
          onLoad={handleLoad}
          onError={handleError}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6f7bf7" />
              <Text style={styles.loadingText}>{t('loadingPreview')}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default WebsitePreview;
