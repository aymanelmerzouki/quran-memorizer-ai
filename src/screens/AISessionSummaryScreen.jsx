/**
 * AI Session Summary Screen
 * Shows detailed results, recommendations, and mutashabihat after AI training
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AIProgressIntegration from '../services/AIProgressIntegration';
import { useAppStore } from '../store/AppStore';
import CircularProgress from '../components/CircularProgress';
import aiTheme from '../theme/aiTheme';

export default function AISessionSummaryScreen({ route, navigation }) {
  const { sessionData } = route.params || {};
  const { store } = useAppStore();
  
  const [summary, setSummary] = useState(null);
  const [detailedResults, setDetailedResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [mutashabihat, setMutashabihat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadSummaryData();
  }, []);

  /**
   * Load all summary data
   */
  const loadSummaryData = async () => {
    setIsLoading(true);

    try {
      // Get session summary
      const summaryData = AIProgressIntegration.getSessionSummary();
      setSummary(summaryData);

      // Get detailed verse results
      const results = AIProgressIntegration.getDetailedResults();
      setDetailedResults(results);

      // Get mutashabihat for errors
      const mutashabihatData = await AIProgressIntegration.getMutashabihatForErrors();
      setMutashabihat(mutashabihatData);

      // Get recommendations
      const recs = await AIProgressIntegration.getRecommendations();
      setRecommendations(recs);

    } catch (error) {
      console.error('[SessionSummary] Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sync results with app store
   */
  const syncWithAppStore = async () => {
    setIsSyncing(true);

    try {
      const result = await AIProgressIntegration.syncWithAppStore(store, 85);
      
      // Show success message
      alert(`✅ تم الحفظ!\n\n${result.updates.filter(u => u.action === 'memorized').length} آيات تم تحديدها كمحفوظة`);
      
    } catch (error) {
      console.error('[SessionSummary] Sync error:', error);
      alert('❌ خطأ في حفظ النتائج');
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Format duration in minutes and seconds
   */
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Get accuracy color
   */
  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 85) return '#28a745';
    if (accuracy >= 70) return '#ffc107';
    return '#dc3545';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a5f3f" />
        <Text style={styles.loadingText}>جاري تحليل النتائج...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 ملخص الجلسة</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Overall Summary Card */}
        {summary && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>النتيجة الإجمالية</Text>
            
            <View style={styles.bigStat}>
              <CircularProgress 
                progress={summary.accuracy} 
                size={140} 
                strokeWidth={14}
              />
              <Text style={styles.bigStatLabel}>الدقة</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{summary.totalWords}</Text>
                <Text style={styles.statLabel}>كلمة</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#28a745' }]}>{summary.correctWords}</Text>
                <Text style={styles.statLabel}>صحيح</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#dc3545' }]}>{summary.incorrectWords}</Text>
                <Text style={styles.statLabel}>خطأ</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{summary.versesRecited}</Text>
                <Text style={styles.statLabel}>آية</Text>
              </View>
            </View>

            <View style={styles.durationRow}>
              <Text style={styles.durationLabel}>⏱️ المدة:</Text>
              <Text style={styles.durationValue}>{formatDuration(summary.duration)}</Text>
            </View>
          </View>
        )}

        {/* Verse-by-Verse Results */}
        {detailedResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>نتائج الآيات</Text>
            {detailedResults.map((result, index) => (
              <View key={index} style={styles.verseResultCard}>
                <View style={styles.verseHeader}>
                  <Text style={styles.verseKey}>{result.verseKey}</Text>
                  <Text style={[styles.verseAccuracy, { color: getAccuracyColor(result.accuracy) }]}>
                    {result.accuracy}%
                  </Text>
                </View>
                <View style={styles.verseStats}>
                  <Text style={styles.verseStat}>✓ {result.correct} صحيح</Text>
                  <Text style={styles.verseStat}>✗ {result.incorrect} خطأ</Text>
                  <Text style={styles.verseStat}>📝 {result.attempts} محاولات</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Mutashabihat (Similar Verses) */}
        {mutashabihat.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 آيات متشابهة</Text>
            <Text style={styles.sectionSubtitle}>
              هذه الآيات تحتوي على عبارات مشابهة للأخطاء التي حدثت
            </Text>
            {mutashabihat.map((item, index) => (
              <View key={index} style={styles.mutashabihatCard}>
                <Text style={styles.mutashabihatVerse}>{item.verseKey}</Text>
                {item.phrases.map((phrase, pIndex) => (
                  <View key={pIndex} style={styles.phraseItem}>
                    <Text style={styles.phraseText}>{phrase.text}</Text>
                    <Text style={styles.phraseCount}>
                      يتكرر {phrase.count} مرة في القرآن
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 توصيات</Text>
            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>{rec.title}</Text>
                <Text style={styles.recommendationReason}>{rec.reason}</Text>
                <Text style={styles.recommendationVerses}>
                  {rec.verses.length} آيات للمراجعة
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton, isSyncing && styles.buttonDisabled]}
            onPress={syncWithAppStore}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>💾 حفظ في سجل الحفظ</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.actionButtonText, { color: '#1a5f3f' }]}>
              🔄 جلسة جديدة
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 20, fontSize: 16, color: '#495057', fontFamily: 'Amiri' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Amiri' },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#6c757d', justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', fontFamily: 'Amiri' },
  bigStat: { alignItems: 'center', marginBottom: 20 },
  bigStatValue: { fontSize: 48, fontWeight: 'bold' },
  bigStatLabel: { fontSize: 14, color: '#6c757d', marginTop: 5 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#495057' },
  statLabel: { fontSize: 12, color: '#6c757d', marginTop: 4 },
  durationRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: '#dee2e6' },
  durationLabel: { fontSize: 16, color: '#6c757d', marginRight: 10 },
  durationValue: { fontSize: 18, fontWeight: 'bold', color: '#1a5f3f' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Amiri' },
  sectionSubtitle: { fontSize: 14, color: '#6c757d', marginBottom: 15, lineHeight: 20, fontFamily: 'Amiri' },
  verseResultCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, elevation: 1 },
  verseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  verseKey: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Amiri' },
  verseAccuracy: { fontSize: 18, fontWeight: 'bold' },
  verseStats: { flexDirection: 'row', justifyContent: 'space-around' },
  verseStat: { fontSize: 14, color: '#6c757d' },
  mutashabihatCard: { backgroundColor: '#fff3cd', borderRadius: 12, padding: 15, marginBottom: 10 },
  mutashabihatVerse: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#856404', fontFamily: 'Amiri' },
  phraseItem: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#ffeaa7' },
  phraseText: { fontSize: 18, fontFamily: 'Amiri', marginBottom: 5 },
  phraseCount: { fontSize: 12, color: '#856404' },
  recommendationCard: { backgroundColor: '#d1ecf1', borderRadius: 12, padding: 15, marginBottom: 10 },
  recommendationTitle: { fontSize: 16, fontWeight: 'bold', color: '#0c5460', marginBottom: 5, fontFamily: 'Amiri' },
  recommendationReason: { fontSize: 14, color: '#0c5460', marginBottom: 8, fontFamily: 'Amiri' },
  recommendationVerses: { fontSize: 12, color: '#0c5460', fontStyle: 'italic' },
  actions: { marginTop: 20 },
  actionButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primaryButton: { backgroundColor: '#1a5f3f' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#1a5f3f' },
  buttonDisabled: { opacity: 0.6 },
  actionButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
