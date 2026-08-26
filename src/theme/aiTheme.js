/**
 * AI Trainer Theme
 * Enhanced colors and styling for AI mode
 */

export const aiTheme = {
  // Primary colors
  primary: '#1a5f3f',
  primaryLight: '#2d8659',
  primaryDark: '#0f3d28',
  
  // Success (correct words)
  success: '#28a745',
  successLight: '#48c774',
  successDark: '#1e7e34',
  successGlow: 'rgba(40, 167, 69, 0.3)',
  
  // Error (incorrect words)
  error: '#dc3545',
  errorLight: '#ff5c6c',
  errorDark: '#bd2130',
  errorGlow: 'rgba(220, 53, 69, 0.3)',
  
  // Warning (skipped verses)
  warning: '#ffc107',
  warningLight: '#ffcd39',
  warningDark: '#d39e00',
  warningBg: '#fff3cd',
  
  // Info
  info: '#17a2b8',
  infoLight: '#3fc3d8',
  infoDark: '#117a8b',
  infoBg: '#d1ecf1',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: {
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
  
  // AI specific
  aiAccent: '#6f42c1',
  aiAccentLight: '#8b5cf6',
  recording: '#dc3545',
  recordingPulse: 'rgba(220, 53, 69, 0.2)',
  
  // Background gradients
  gradientBg: ['#f8f9fa', '#e9ecef'],
  gradientSuccess: ['#28a745', '#20c997'],
  gradientError: ['#dc3545', '#f64e60'],
  gradientPrimary: ['#1a5f3f', '#2d8659'],
  
  // Text
  textPrimary: '#212529',
  textSecondary: '#6c757d',
  textLight: '#adb5bd',
  textInverse: '#ffffff',
  
  // Shadows
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    glow: {
      shadowColor: '#1a5f3f',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  
  // Border radius
  radius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    huge: 32,
    massive: 48,
  },
  
  // Animation durations (ms)
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

export default aiTheme;
