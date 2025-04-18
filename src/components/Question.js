import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';

const Question = ({ questionId, type, options = [], value, onChange }) => {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState(
    Array.isArray(value) ? value : []
  );

  const handleMultiSelectToggle = (option) => {
    const updated = [...selectedOptions];
    const index = updated.indexOf(option);
    
    if (index === -1) {
      updated.push(option);
    } else {
      updated.splice(index, 1);
    }
    
    setSelectedOptions(updated);
    onChange(updated);
  };

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChange}
            placeholder={t('typeHere')}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
          />
        );
        
      case 'textarea':
        return (
          <TextInput
            style={styles.textArea}
            value={value}
            onChangeText={onChange}
            placeholder={t('typeHere')}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        );
        
      case 'select':
        return (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  value === option && styles.selectedOption
                ]}
                onPress={() => onChange(option)}
              >
                <Text 
                  style={[
                    styles.optionText,
                    value === option && styles.selectedOptionText
                  ]}
                >
                  {t(`options.${option}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
        
      case 'multiselect':
        return (
          <ScrollView style={styles.multiSelectContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.checkboxOption}
                onPress={() => handleMultiSelectToggle(option)}
              >
                <View style={styles.checkboxWrapper}>
                  <View style={[
                    styles.checkbox,
                    selectedOptions.includes(option) && styles.checkedCheckbox
                  ]}>
                    {selectedOptions.includes(option) && (
                      <Feather name="check" size={14} color="#fff" />
                    )}
                  </View>
                </View>
                <Text style={styles.checkboxText}>{t(`options.${option}`)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
        
      case 'toggle':
        return (
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>{t('no')}</Text>
            <Switch
              value={value === true}
              onValueChange={(newValue) => onChange(newValue)}
              trackColor={{ false: "#3e3e5e", true: "#6f7bf7" }}
              thumbColor="#fff"
            />
            <Text style={styles.toggleLabel}>{t('yes')}</Text>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{t(`questions.${questionId}`)}</Text>
      {renderInput()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  questionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: '#6f7bf7',
  },
  optionText: {
    color: '#fff',
  },
  selectedOptionText: {
    fontWeight: '500',
  },
  multiSelectContainer: {
    maxHeight: 200,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkboxWrapper: {
    marginRight: 15,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#6f7bf7',
    borderColor: '#6f7bf7',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    color: '#fff',
    marginHorizontal: 15,
    fontSize: 16,
  },
});

export default Question;
