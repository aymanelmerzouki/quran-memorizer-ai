#!/usr/bin/env node
/**
 * Test Script for Quran Hybrid App
 * Validates imports, structure, and configuration
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function test(name, condition, errorMsg = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    log(`✓ ${name}`, colors.green);
    return true;
  } else {
    failedTests++;
    log(`✗ ${name}`, colors.red);
    if (errorMsg) log(`  ${errorMsg}`, colors.yellow);
    return false;
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

function fileContains(filePath, searchString) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf-8');
    return content.includes(searchString);
  } catch (e) {
    return false;
  }
}

console.log('\n' + '='.repeat(60));
log('🧪 QURAN HYBRID APP - TEST SUITE', colors.blue);
console.log('='.repeat(60) + '\n');

// ============================================================================
// 1. Core Files Structure
// ============================================================================
log('\n📁 Testing Core Files Structure...', colors.blue);

test('App.jsx exists', fileExists('App.jsx'));
test('package.json exists', fileExists('package.json'));
test('app.json exists', fileExists('app.json'));

// ============================================================================
// 2. Services
// ============================================================================
log('\n🔧 Testing Services...', colors.blue);

test('AIBackendService.js exists', fileExists('src/services/AIBackendService.js'));
test('AudioRecordingManager.js exists', fileExists('src/services/AudioRecordingManager.js'));
test('AIProgressIntegration.js exists', fileExists('src/services/AIProgressIntegration.js'));

// ============================================================================
// 3. Screens
// ============================================================================
log('\n📱 Testing Screens...', colors.blue);

test('AITrainerScreen.jsx exists', fileExists('src/screens/AITrainerScreen.jsx'));
test('AISessionSummaryScreen.jsx exists', fileExists('src/screens/AISessionSummaryScreen.jsx'));
test('DashboardScreen.jsx exists', fileExists('src/screens/DashboardScreen.jsx'));
test('EntranceScreen.jsx exists', fileExists('src/screens/EntranceScreen.jsx'));

// ============================================================================
// 4. UI Components
// ============================================================================
log('\n🎨 Testing UI Components...', colors.blue);

test('AnimatedWord.jsx exists', fileExists('src/components/AnimatedWord.jsx'));
test('StatCard.jsx exists', fileExists('src/components/StatCard.jsx'));
test('CircularProgress.jsx exists', fileExists('src/components/CircularProgress.jsx'));
test('RecordingPulse.jsx exists', fileExists('src/components/RecordingPulse.jsx'));
test('ConnectionStatus.jsx exists', fileExists('src/components/ConnectionStatus.jsx'));

// ============================================================================
// 5. Theme
// ============================================================================
log('\n🎨 Testing Theme...', colors.blue);

test('aiTheme.js exists', fileExists('src/theme/aiTheme.js'));
test('aiTheme exports colors', fileContains('src/theme/aiTheme.js', 'export const aiTheme'));

// ============================================================================
// 6. Navigation Integration
// ============================================================================
log('\n🧭 Testing Navigation...', colors.blue);

test('AITrainer imported in App.jsx', 
  fileContains('App.jsx', 'AITrainerScreen'));
test('AISessionSummary imported in App.jsx', 
  fileContains('App.jsx', 'AISessionSummaryScreen'));
test('AITrainer in Stack Navigator', 
  fileContains('App.jsx', '<Stack.Screen name="AITrainer"'));
test('AISessionSummary in Stack Navigator', 
  fileContains('App.jsx', '<Stack.Screen name="AISessionSummary"'));

// ============================================================================
// 7. Dependencies
// ============================================================================
log('\n📦 Testing Dependencies...', colors.blue);

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

test('socket.io-client installed', deps['socket.io-client'] !== undefined);
test('expo-av installed', deps['expo-av'] !== undefined);
test('expo-haptics installed', deps['expo-haptics'] !== undefined);
test('react-native-reanimated installed', deps['react-native-reanimated'] !== undefined);
test('react-native-svg installed', deps['react-native-svg'] !== undefined);

// ============================================================================
// 8. Import Validation
// ============================================================================
log('\n🔍 Testing Imports...', colors.blue);

test('AITrainer imports AIBackendService', 
  fileContains('src/screens/AITrainerScreen.jsx', "from '../services/AIBackendService'"));
test('AITrainer imports AudioRecordingManager', 
  fileContains('src/screens/AITrainerScreen.jsx', "from '../services/AudioRecordingManager'"));
test('AITrainer imports AIProgressIntegration', 
  fileContains('src/screens/AITrainerScreen.jsx', "from '../services/AIProgressIntegration'"));
test('AITrainer imports AnimatedWord', 
  fileContains('src/screens/AITrainerScreen.jsx', "from '../components/AnimatedWord'"));
test('AITrainer imports aiTheme', 
  fileContains('src/screens/AITrainerScreen.jsx', "from '../theme/aiTheme'"));

// ============================================================================
// 9. Dashboard Integration
// ============================================================================
log('\n🏠 Testing Dashboard Integration...', colors.blue);

test('Dashboard has AI Trainer button', 
  fileContains('src/screens/DashboardScreen.jsx', 'تدريب بالذكاء الاصطناعي') ||
  fileContains('src/screens/DashboardScreen.jsx', 'AITrainer'));

// ============================================================================
// 10. Documentation
// ============================================================================
log('\n📖 Testing Documentation...', colors.blue);

test('README_HYBRID.md exists', fileExists('README_HYBRID.md'));
test('UI_UX_IMPROVEMENTS.md exists', fileExists('UI_UX_IMPROVEMENTS.md'));

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(60));
log('📊 TEST SUMMARY', colors.blue);
console.log('='.repeat(60));

log(`\nTotal Tests: ${totalTests}`, colors.blue);
log(`Passed: ${passedTests}`, colors.green);
log(`Failed: ${failedTests}`, failedTests > 0 ? colors.red : colors.green);

const successRate = ((passedTests / totalTests) * 100).toFixed(1);
log(`Success Rate: ${successRate}%`, successRate >= 90 ? colors.green : colors.yellow);

console.log('\n' + '='.repeat(60) + '\n');

if (failedTests === 0) {
  log('🎉 All tests passed! App is ready for build.', colors.green);
  process.exit(0);
} else {
  log(`⚠️  ${failedTests} test(s) failed. Please fix before building.`, colors.yellow);
  process.exit(1);
}
