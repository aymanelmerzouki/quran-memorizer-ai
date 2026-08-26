/**
 * Recording Pulse Component
 * Animated pulsing indicator when recording is active
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import aiTheme from '../theme/aiTheme';

export default function RecordingPulse({ isRecording = false, size = 20 }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
      
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 800 }),
          withTiming(0.8, { duration: 800 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isRecording]);

  const animatedOuterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!isRecording) return null;

  return (
    <View style={[styles.container, { width: size * 3, height: size * 3 }]}>
      <Animated.View
        style={[
          styles.outerCircle,
          { width: size * 3, height: size * 3, borderRadius: size * 1.5 },
          animatedOuterStyle,
        ]}
      />
      <View style={[styles.innerCircle, { width: size, height: size, borderRadius: size / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  outerCircle: {
    position: 'absolute',
    backgroundColor: aiTheme.recordingPulse,
    borderWidth: 2,
    borderColor: aiTheme.recording,
  },
  innerCircle: {
    backgroundColor: aiTheme.recording,
    ...aiTheme.shadow.glow,
  },
});
