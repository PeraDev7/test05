import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';

// Simple code editor with syntax highlighting
const WYSIWYGEditor = ({ code, language, onChange }) => {
  const { t } = useTranslation();
  const [editorValue, setEditorValue] = useState(code || '');
  
  // Update internal state when code prop changes
  useEffect(() => {
    setEditorValue(code || '');
  }, [code, language]);

  // Handle text changes and propagate to parent
  const handleTextChange = (text) => {
    setEditorValue(text);
    onChange(text);
  };

  // Insert common code snippets
  const insertSnippet = (snippet) => {
    let snippetCode = '';
    
    switch (language) {
      case 'html':
        if (snippet === 'div') {
          snippetCode = '<div class="">\n  \n</div>';
        } else if (snippet === 'button') {
          snippetCode = '<button class="">\n  Button\n</button>';
        } else if (snippet === 'input') {
          snippetCode = '<input type="text" class="" placeholder="" />';
        }
        break;
        
      case 'css':
        if (snippet === 'flex') {
          snippetCode = 'display: flex;\njustify-content: center;\nalign-items: center;';
        } else if (snippet === 'media') {
          snippetCode = '@media (max-width: 768px) {\n  \n}';
        } else if (snippet === 'animation') {
          snippetCode = '@keyframes animationName {\n  0% { }\n  100% { }\n}';
        }
        break;
        
      case 'js':
        if (snippet === 'function') {
          snippetCode = 'function functionName() {\n  \n}';
        } else if (snippet === 'event') {
          snippetCode = "document.querySelector('').addEventListener('click', function() {\n  \n});";
        } else if (snippet === 'fetch') {
          snippetCode = "fetch('url')\n  .then(response => response.json())\n  .then(data => {\n    \n  });";
        }
        break;
    }
    
    const newText = editorValue + snippetCode;
    handleTextChange(newText);
  };

  // Render code snippets toolbar
  const renderSnippetsToolbar = () => {
    let snippets = [];
    
    switch (language) {
      case 'html':
        snippets = ['div', 'button', 'input'];
        break;
      case 'css':
        snippets = ['flex', 'media', 'animation'];
        break;
      case 'js':
        snippets = ['function', 'event', 'fetch'];
        break;
    }
    
    return (
      <View style={styles.snippetsToolbar}>
        {snippets.map((snippet) => (
          <TouchableOpacity
            key={snippet}
            style={styles.snippetButton}
            onPress={() => insertSnippet(snippet)}
          >
            <Text style={styles.snippetButtonText}>{snippet}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSnippetsToolbar()}
      
      <ScrollView style={styles.editorContainer}>
        <TextInput
          value={editorValue}
          onChangeText={handleTextChange}
          style={styles.editor}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          placeholder={t('enterCodeHere')}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  snippetsToolbar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  snippetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 8,
  },
  snippetButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  editorContainer: {
    flex: 1,
    padding: 10,
  },
  editor: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
    padding: 0,
    minHeight: 200,
  },
});

export default WYSIWYGEditor;
