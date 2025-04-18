import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';
import { Feather } from '@expo/vector-icons';

import Question from '../components/Question';
import BottomNavigation from '../components/BottomNavigation';
import { generateWebsite } from '../config/anthropic';

const questions = [
  {
    id: 'websiteType',
    type: 'select',
    options: ['personal', 'business', 'portfolio', 'blog', 'ecommerce'],
  },
  {
    id: 'websiteName',
    type: 'text',
  },
  {
    id: 'colorScheme',
    type: 'select',
    options: ['light', 'dark', 'colorful', 'minimal', 'custom'],
  },
  {
    id: 'primaryFeatures',
    type: 'multiselect',
    options: ['contactForm', 'gallery', 'blog', 'services', 'testimonials', 'pricing', 'about'],
  },
  {
    id: 'seoKeywords',
    type: 'text',
  },
  {
    id: 'responsive',
    type: 'toggle',
  },
  {
    id: 'description',
    type: 'textarea',
  },
];

const QuestionnaireScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollViewRef = useRef(null);

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Format answers with question labels
      const formattedAnswers = {};
      questions.forEach(question => {
        formattedAnswers[t(`questions.${question.id}`)] = answers[question.id] || '';
      });

      // Generate website using Claude API
      const websiteCode = await generateWebsite(formattedAnswers);
      
      // Navigate to preview screen with generated code
      navigation.navigate('Preview', { websiteCode });
    } catch (error) {
      console.error('Error generating website:', error);
      setError(t('generationError'));
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('createWebsite')}</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {error && (
          <Animatable.Text animation="shake" style={styles.errorText}>
            {error}
          </Animatable.Text>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6f7bf7" />
            <Text style={styles.loadingText}>{t('generatingWebsite')}</Text>
          </View>
        ) : (
          <Animatable.View 
            animation="fadeIn" 
            duration={500}
            key={currentQuestion.id}
          >
            <Question
              questionId={currentQuestion.id}
              type={currentQuestion.type}
              options={currentQuestion.options}
              value={answers[currentQuestion.id] || ''}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />
          </Animatable.View>
        )}
      </ScrollView>

      <BottomNavigation
        currentStep={currentStep}
        totalSteps={questions.length}
        onBack={handleBack}
        onNext={handleNext}
        isLastStep={currentStep === questions.length - 1}
        loading={loading}
      />
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
  spacer: {
    width: 34,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6f7bf7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
});

export default QuestionnaireScreen;
