/**
 * AI Progress Integration
 * Connects AI Trainer results with the app's memorization system
 */

import { markAsMemorized, markAsNotMemorized, updateVerseStrength } from '../db/queries';
import { getPhrasesForAyah } from '../db/mutashabihat';

class AIProgressIntegration {
  constructor() {
    this.sessionResults = new Map(); // verseKey -> { correct, incorrect, attempts }
    this.currentSession = null;
    this.mutashabihatCache = new Map();
  }

  /**
   * Start a new AI training session
   */
  startSession(pageNumber, surahNumber = null) {
    this.currentSession = {
      pageNumber,
      surahNumber,
      startTime: Date.now(),
      totalWords: 0,
      correctWords: 0,
      incorrectWords: 0,
      versesRecited: new Set(),
      errors: [],
    };
    this.sessionResults.clear();
  }

  /**
   * Process word result from AI backend
   * @param {Object} wordData - Word result from AI alignment
   */
  async processWordResult(wordData) {
    if (!this.currentSession) return;

    const { verse_key, word_index, correct, word_text } = wordData;

    // Update session stats
    this.currentSession.totalWords++;
    if (correct) {
      this.currentSession.correctWords++;
    } else {
      this.currentSession.incorrectWords++;
      this.currentSession.errors.push({
        verse_key,
        word_index,
        word_text,
        timestamp: Date.now(),
      });
    }

    // Track verse-level results
    if (!this.sessionResults.has(verse_key)) {
      this.sessionResults.set(verse_key, {
        correct: 0,
        incorrect: 0,
        attempts: 0,
      });
      this.currentSession.versesRecited.add(verse_key);
    }

    const verseResult = this.sessionResults.get(verse_key);
    verseResult.attempts++;
    if (correct) {
      verseResult.correct++;
    } else {
      verseResult.incorrect++;
    }
  }

  /**
   * Get accuracy for a specific verse
   * @param {string} verseKey - Verse key (e.g., "1:1")
   * @returns {number} - Accuracy percentage (0-100)
   */
  getVerseAccuracy(verseKey) {
    const result = this.sessionResults.get(verseKey);
    if (!result || result.attempts === 0) return 0;
    return Math.round((result.correct / result.attempts) * 100);
  }

  /**
   * Update app store based on AI session results
   * Auto-mark verses as memorized if accuracy is high
   * @param {Object} store - AppStore instance
   * @param {number} thresholdAccuracy - Minimum accuracy to mark as memorized (default: 85%)
   */
  async syncWithAppStore(store, thresholdAccuracy = 85) {
    if (!this.currentSession) return;

    const updates = [];

    for (const [verseKey, result] of this.sessionResults.entries()) {
      const accuracy = this.getVerseAccuracy(verseKey);
      
      // Parse verse key to get verse ID
      const [surahNum, ayahNum] = verseKey.split(':').map(Number);
      const verse = store.current.verseIndex.find(
        v => v.chapter_id === surahNum && v.verse_number === ayahNum
      );

      if (!verse) continue;

      const verseId = verse.id;

      // Mark as memorized if accuracy is high
      if (accuracy >= thresholdAccuracy && result.attempts >= 3) {
        await markAsMemorized(verseId, verseKey);
        store.current.memorizedSet.add(verseId);
        updates.push({ verseKey, action: 'memorized', accuracy });
      }
      // Mark as needs review if accuracy is low
      else if (accuracy < 60 && result.attempts >= 3) {
        await markAsNotMemorized(verseId);
        store.current.memorizedSet.delete(verseId);
        updates.push({ verseKey, action: 'needs_review', accuracy });
      }
    }

    return {
      updates,
      sessionSummary: this.getSessionSummary(),
    };
  }

  /**
   * Get mutashabihat (similar verses) for errors
   * Helps user learn difficult phrases
   */
  async getMutashabihatForErrors() {
    if (!this.currentSession) return [];

    const errorVerses = new Set(
      this.currentSession.errors.map(e => e.verse_key)
    );

    const mutashabihat = [];

    for (const verseKey of errorVerses) {
      // Check cache first
      if (this.mutashabihatCache.has(verseKey)) {
        mutashabihat.push({
          verseKey,
          phrases: this.mutashabihatCache.get(verseKey),
        });
        continue;
      }

      // Fetch mutashabihat for this verse
      try {
        const phrases = await getPhrasesForAyah(verseKey);
        this.mutashabihatCache.set(verseKey, phrases);
        
        if (phrases.length > 0) {
          mutashabihat.push({
            verseKey,
            phrases,
          });
        }
      } catch (error) {
        console.error('[AIProgress] Error fetching mutashabihat:', error);
      }
    }

    return mutashabihat;
  }

  /**
   * Get session summary
   */
  getSessionSummary() {
    if (!this.currentSession) return null;

    const duration = Date.now() - this.currentSession.startTime;
    const avgAccuracy = this._calculateAverageAccuracy();

    return {
      duration: Math.round(duration / 1000), // seconds
      totalWords: this.currentSession.totalWords,
      correctWords: this.currentSession.correctWords,
      incorrectWords: this.currentSession.incorrectWords,
      accuracy: avgAccuracy,
      versesRecited: this.currentSession.versesRecited.size,
      errorCount: this.currentSession.errors.length,
    };
  }

  /**
   * Get detailed verse-by-verse results
   */
  getDetailedResults() {
    const results = [];

    for (const [verseKey, result] of this.sessionResults.entries()) {
      results.push({
        verseKey,
        accuracy: this.getVerseAccuracy(verseKey),
        correct: result.correct,
        incorrect: result.incorrect,
        attempts: result.attempts,
      });
    }

    // Sort by accuracy (worst first)
    results.sort((a, b) => a.accuracy - b.accuracy);

    return results;
  }

  /**
   * Get recommendations for next practice
   * Based on errors and mutashabihat
   */
  async getRecommendations() {
    const detailedResults = this.getDetailedResults();
    const mutashabihat = await this.getMutashabihatForErrors();

    const recommendations = [];

    // Recommend verses with low accuracy
    const weakVerses = detailedResults.filter(r => r.accuracy < 70);
    if (weakVerses.length > 0) {
      recommendations.push({
        type: 'weak_verses',
        title: 'آيات تحتاج مراجعة',
        verses: weakVerses.map(v => v.verseKey),
        reason: 'دقة منخفضة في الأداء',
      });
    }

    // Recommend practicing mutashabihat
    if (mutashabihat.length > 0) {
      const mutashabihatVerses = new Set();
      mutashabihat.forEach(m => {
        m.phrases.forEach(phrase => {
          if (phrase.ayahs) {
            phrase.ayahs.forEach(ayah => mutashabihatVerses.add(ayah));
          }
        });
      });

      recommendations.push({
        type: 'mutashabihat',
        title: 'آيات متشابهة',
        verses: Array.from(mutashabihatVerses),
        reason: 'هذه الآيات تحتوي على عبارات متشابهة مع أخطائك',
      });
    }

    return recommendations;
  }

  /**
   * End current session
   */
  endSession() {
    const summary = this.getSessionSummary();
    this.currentSession = null;
    return summary;
  }

  /**
   * Calculate average accuracy across all verses
   */
  _calculateAverageAccuracy() {
    if (this.sessionResults.size === 0) return 0;

    let totalAccuracy = 0;
    for (const verseKey of this.sessionResults.keys()) {
      totalAccuracy += this.getVerseAccuracy(verseKey);
    }

    return Math.round(totalAccuracy / this.sessionResults.size);
  }

  /**
   * Get current session data
   */
  getCurrentSession() {
    return this.currentSession;
  }

  /**
   * Clear all data
   */
  clear() {
    this.sessionResults.clear();
    this.mutashabihatCache.clear();
    this.currentSession = null;
  }
}

export default new AIProgressIntegration();
