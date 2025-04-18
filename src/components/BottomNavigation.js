import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';

const BottomNavigation = ({ currentStep, totalSteps, onBack, onNext, isLastStep, loading }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {t('step')} {currentStep + 1}/{totalSteps}
        </Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={onBack}
          disabled={currentStep === 0 || loading}
          activeOpacity={currentStep === 0 ? 1 : 0.7}
        >
          <Feather 
            name="arrow-left" 
            size={20} 
            color={currentStep === 0 ? "#666" : "#fff"} 
          />
          <Text 
            style={[
              styles.buttonText, 
              currentStep === 0 && styles.disabledButtonText
            ]}
          >
            {t('back')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={onNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>
                {isLastStep ? t('finish') : t('next')}
              </Text>
              <Feather 
                name={isLastStep ? "check" : "arrow-right"} 
                size={20} 
                color="#fff" 
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  nextButton: {
    backgroundColor: '#6f7bf7',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    marginHorizontal: 8,
  },
  disabledButtonText: {
    color: '#666',
  },
});

export default BottomNavigation;
