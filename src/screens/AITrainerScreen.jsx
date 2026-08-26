/**
 * AI Trainer Screen
 * Real-time Quran recitation tracking with word-by-word feedback
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AIBackendService from '../services/AIBackendService';
import AudioRecordingManager from '../services/AudioRecordingManager';
import AIProgressIntegration from '../services/AIProgressIntegration';
import { useAppStore } from '../store/AppStore';
import AnimatedWord from '../components/AnimatedWord';
import StatCard from '../components/StatCard';
import RecordingPulse from '../components/RecordingPulse';
import ConnectionStatus from '../components/ConnectionStatus';
import aiTheme from '../theme/aiTheme';

export default function AITrainerScreen({ route, navigation }) {
  const { pageNumber = 1, surahNumber = null } = route.params || {};
  const { store } = useAppStore(); // Access app store for progression
  
  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentWords, setCurrentWords] = useState([]);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    correctWords: 0,
    incorrectWords: 0,
    skippedVerses: 0,
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const scrollViewRef = useRef(null);

  // Initialize connection on mount
  useEffect(() => {
    initializeAI();
    return () => {
      // Cleanup on unmount
      if (isRecording) {
        stopRecording();
      }
      AIBackendService.disconnect();
    };
  }, []);

  /**
   * Initialize AI backend connection
   */
  const initializeAI = async () => {
    setIsLoading(true);
    
    // Initialize audio permissions
    const audioReady = await AudioRecordingManager.initialize();
    if (!audioReady) {
      Alert.alert('خطأ', 'لا يمكن الوصول إلى الميكروفون');
      setIsLoading(false);
      return;
    }

    // Connect to backend
    const connected = await AIBackendService.connect();
    setIsConnected(connected);
    
    if (!connected) {
      Alert.alert(
        'خطأ في الاتصال',
        'تأكد من تشغيل الخادم على http://localhost:7860'
      );
      setIsLoading(false);
      return;
    }

    // Setup event listeners
    setupEventListeners();

    // Start session
    AIBackendService.startSession(pageNumber, surahNumber);
    AIProgressIntegration.startSession(pageNumber, surahNumber);
    
    setIsLoading(false);
  };

  /**
   * Setup backend event listeners
   */
  const setupEventListeners = () => {
    // Word result from AI alignment
    AIBackendService.on('wordResult', handleWordResult);
    
    // Sequence errors (skipped verses, etc.)
    AIBackendService.on('sequenceError', handleSequenceError);
    
    // Session updates
    AIBackendService.on('sessionUpdate', handleSessionUpdate);
    
    // Connection errors
    AIBackendService.on('error', handleError);
    
    // Disconnection
    AIBackendService.on('disconnect', () => {
      setIsConnected(false);
      if (isRecording) stopRecording();
    });
  };

  /**
   * Handle word-level alignment result
   */
  const handleWordResult = (data) => {
    console.log('[AITrainer] Word result:', data);
    
    // Process with progress integration
    AIProgressIntegration.processWordResult(data);
    
    // Update highlighted word
    if (data.word_index !== undefined) {
      setHighlightedWordIndex(data.word_index);
      
      // Haptic feedback
      if (data.correct) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSessionStats(prev => ({ ...prev, correctWords: prev.correctWords + 1 }));
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setSessionStats(prev => ({ ...prev, incorrectWords: prev.incorrectWords + 1 }));
      }
    }

    // Update words display
    if (data.words) {
      setCurrentWords(data.words);
    }
  };

  /**
   * Handle sequence errors (skipped verses)
   */
  const handleSequenceError = (data) => {
    console.log('[AITrainer] Sequence error:', data);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    setErrors(prev => [...prev, {
      type: data.type,
      message: data.message,
      timestamp: Date.now(),
    }]);

    if (data.type === 'skip_aya') {
      setSessionStats(prev => ({ ...prev, skippedVerses: prev.skippedVerses + 1 }));
    }
  };

  /**
   * Handle session updates
   */
  const handleSessionUpdate = (data) => {
    console.log('[AITrainer] Session update:', data);
  };

  /**
   * Handle errors
   */
  const handleError = (data) => {
    console.error('[AITrainer] Error:', data);
    Alert.alert('خطأ', data.message || 'حدث خطأ غير متوقع');
  };

  /**
   * Start recording and streaming
   */
  const startRecording = async () => {
    const started = await AudioRecordingManager.startRecording(async (audioUri) => {
      // Send each audio chunk to backend
      await AIBackendService.sendAudioChunk(audioUri);
    });

    if (started) {
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  /**
   * Stop recording
   */
  const stopRecording = async () => {
    await AudioRecordingManager.stopRecording();
    setIsRecording(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Reset session
   */
  const resetSession = () => {
    AIBackendService.resetSession();
    AIProgressIntegration.clear();
    setHighlightedWordIndex(null);
    setCurrentWords([]);
    setSessionStats({ correctWords: 0, incorrectWords: 0, skippedVerses: 0 });
    setErrors([]);
  };

  /**
   * End session and show summary
   */
  const endSession = async () => {
    if (isRecording) {
      await stopRecording();
    }
    
    AIBackendService.stopSession();
    const sessionSummary = AIProgressIntegration.endSession();
    
    // Navigate to summary screen
    navigation.navigate('AISessionSummary', {
      sessionData: sessionSummary,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a5f3f" />
        <Text style={styles.loadingText}>جاري الاتصال بنظام الذكاء الاصطناعي...</Text>
      </View>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>⚠️ غير متصل</Text>
        <Text style={styles.errorText}>
          تأكد من تشغيل خادم الذكاء الاصطناعي{'\n'}
          http://localhost:7860
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeAI}>
          <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      {/* Header with stats */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>🎤 تدريب بالذكاء الاصطناعي</Text>
          <ConnectionStatus isConnected={isConnected} />
        </View>
        <View style={styles.statsRow}>
          <StatCard 
            value={sessionStats.correctWords} 
            label="صحيح" 
            icon="✓"
            type="success"
          />
          <StatCard 
            value={sessionStats.incorrectWords} 
            label="خطأ" 
            icon="✗"
            type="error"
          />
          <StatCard 
            value={sessionStats.skippedVerses} 
            label="متخطاة" 
            icon="⚠"
            type="warning"
          />
        </View>
      </View>

      {/* Quran text display with word highlighting */}
      <ScrollView ref={scrollViewRef} style={styles.textContainer} contentContainerStyle={styles.textContent}>
        {currentWords.length > 0 ? (
          <View style={styles.wordsContainer}>
            {currentWords.map((word, index) => (
              <AnimatedWord
                key={index}
                word={word.text}
                isHighlighted={index === highlightedWordIndex}
                isCorrect={word.correct === true}
                isIncorrect={word.correct === false}
              />
            ))}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>🎙️</Text>
            <Text style={styles.placeholderText}>ابدأ القراءة لرؤية النص...</Text>
          </View>
        )}
      </ScrollView>

      {/* Error messages */}
      {errors.length > 0 && (
        <View style={styles.errorsContainer}>
          {errors.slice(-3).map((error, index) => (
            <View key={index} style={styles.errorMessage}>
              <Text style={styles.errorMessageText}>{error.message}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Control buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          {isRecording && (
            <View style={styles.pulseContainer}>
              <RecordingPulse isRecording={isRecording} size={16} />
            </View>
          )}
          <Text style={styles.recordButtonText}>
            {isRecording ? '⏸ إيقاف' : '🎤 ابدأ القراءة'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetSession}>
          <Text style={styles.resetButtonText}>🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endButton} onPress={endSession}>
          <Text style={styles.endButtonText}>✓ إنهاء</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: aiTheme.gray[100] },
  loadingText: { marginTop: 20, fontSize: aiTheme.fontSize.md, color: aiTheme.textSecondary, fontFamily: 'Amiri' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: aiTheme.gray[100] },
  errorTitle: { fontSize: aiTheme.fontSize.xxl, fontWeight: 'bold', color: aiTheme.error, marginBottom: 10 },
  errorText: { fontSize: aiTheme.fontSize.md, color: aiTheme.textSecondary, textAlign: 'center', lineHeight: 24 },
  retryButton: { marginTop: 20, backgroundColor: aiTheme.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: aiTheme.radius.md, ...aiTheme.shadow.md },
  retryButtonText: { color: aiTheme.white, fontSize: aiTheme.fontSize.md, fontWeight: 'bold' },
  header: { padding: aiTheme.spacing.lg, backgroundColor: aiTheme.white, borderBottomWidth: 1, borderBottomColor: aiTheme.gray[300], ...aiTheme.shadow.sm },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: aiTheme.fontSize.xl, fontWeight: 'bold', fontFamily: 'Amiri', color: aiTheme.primary },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', gap: aiTheme.spacing.sm },
  textContainer: { flex: 1, padding: aiTheme.spacing.lg },
  textContent: { flexGrow: 1 },
  wordsContainer: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: aiTheme.spacing.xxl },
  placeholderIcon: { fontSize: 64, marginBottom: aiTheme.spacing.lg, opacity: 0.3 },
  placeholderText: { fontSize: aiTheme.fontSize.lg, color: aiTheme.textLight, textAlign: 'center', fontFamily: 'Amiri' },
  errorsContainer: { padding: aiTheme.spacing.md, backgroundColor: aiTheme.warningBg, borderTopWidth: 1, borderTopColor: aiTheme.warning },
  errorMessage: { padding: aiTheme.spacing.sm, marginVertical: 4, backgroundColor: aiTheme.warning, borderRadius: aiTheme.radius.sm, ...aiTheme.shadow.sm },
  errorMessageText: { fontSize: aiTheme.fontSize.sm, color: aiTheme.warningDark, textAlign: 'right', fontFamily: 'Amiri' },
  controls: { flexDirection: 'row', padding: aiTheme.spacing.lg, backgroundColor: aiTheme.white, borderTopWidth: 1, borderTopColor: aiTheme.gray[300], ...aiTheme.shadow.lg, gap: aiTheme.spacing.sm },
  recordButton: { flex: 3, backgroundColor: aiTheme.primary, padding: aiTheme.spacing.md, borderRadius: aiTheme.radius.lg, alignItems: 'center', justifyContent: 'center', position: 'relative', ...aiTheme.shadow.md },
  recordButtonActive: { backgroundColor: aiTheme.recording, ...aiTheme.shadow.glow },
  recordButtonText: { color: aiTheme.white, fontSize: aiTheme.fontSize.lg, fontWeight: 'bold' },
  pulseContainer: { position: 'absolute', left: 20 },
  resetButton: { flex: 1, backgroundColor: aiTheme.gray[600], padding: aiTheme.spacing.md, borderRadius: aiTheme.radius.lg, alignItems: 'center', justifyContent: 'center', ...aiTheme.shadow.sm },
  resetButtonText: { color: aiTheme.white, fontSize: 20 },
  endButton: { flex: 1.5, backgroundColor: aiTheme.success, padding: aiTheme.spacing.md, borderRadius: aiTheme.radius.lg, alignItems: 'center', ...aiTheme.shadow.md },
  endButtonText: { color: aiTheme.white, fontSize: aiTheme.fontSize.md, fontWeight: 'bold' },
});
