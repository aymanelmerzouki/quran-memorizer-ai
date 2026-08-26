/**
 * Connection Status Indicator
 * Shows real-time connection status to AI backend
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import aiTheme from '../theme/aiTheme';

export default function ConnectionStatus({ isConnected = false, compact = false }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isConnected) {
      // Steady glow for connected
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        false
      );
    } else {
      // Faster blink for disconnected
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
    }
  }, [isConnected]);

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: isConnected ? aiTheme.success : aiTheme.error },
            animatedDotStyle,
          ]}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          { backgroundColor: isConnected ? aiTheme.success : aiTheme.error },
          animatedDotStyle,
        ]}
      />
      <Text style={[styles.text, { color: isConnected ? aiTheme.success : aiTheme.error }]}>
        {isConnected ? 'متصل' : 'غير متصل'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: aiTheme.spacing.md,
    paddingVertical: aiTheme.spacing.sm,
    backgroundColor: aiTheme.white,
    borderRadius: aiTheme.radius.full,
    ...aiTheme.shadow.sm,
  },
  compactContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: aiTheme.spacing.xs,
    ...aiTheme.shadow.sm,
  },
  text: {
    fontSize: aiTheme.fontSize.sm,
    fontWeight: '600',
  },
});
