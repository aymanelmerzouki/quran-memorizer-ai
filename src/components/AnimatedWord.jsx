/**
 * Animated Word Component
 * Displays Quranic words with smooth animations for correct/incorrect feedback
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import aiTheme from '../theme/aiTheme';

export default function AnimatedWord({ word, isHighlighted, isCorrect, isIncorrect }) {
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(aiTheme.white);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isHighlighted) {
      // Pulse animation
      scale.value = withSequence(
        withSpring(1.15, { damping: 10, stiffness: 150 }),
        withSpring(1.05, { damping: 10, stiffness: 150 })
      );
      
      // Color animation
      if (isCorrect) {
        backgroundColor.value = withTiming(aiTheme.success, { duration: 300 });
      } else if (isIncorrect) {
        backgroundColor.value = withTiming(aiTheme.error, { duration: 300 });
      }
    } else {
      // Reset animation
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
      
      // Keep color if marked
      if (isCorrect) {
        backgroundColor.value = aiTheme.successLight;
        opacity.value = 0.7;
      } else if (isIncorrect) {
        backgroundColor.value = aiTheme.errorLight;
        opacity.value = 0.7;
      } else {
        backgroundColor.value = aiTheme.white;
        opacity.value = 1;
      }
    }
  }, [isHighlighted, isCorrect, isIncorrect]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: backgroundColor.value,
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.word}>{word}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: aiTheme.spacing.xs,
    padding: aiTheme.spacing.sm,
    paddingHorizontal: aiTheme.spacing.md,
    borderRadius: aiTheme.radius.md,
    ...aiTheme.shadow.sm,
  },
  word: {
    fontSize: aiTheme.fontSize.xxl,
    fontFamily: 'Amiri',
    color: aiTheme.textPrimary,
  },
});
