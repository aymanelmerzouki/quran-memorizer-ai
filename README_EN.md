# 🕌 Quran Memorizer AI

> **Hybrid React Native mobile app with AI voice recognition for Quran memorization**

[![GitHub Release](https://img.shields.io/github/v/release/aymanelmerzouki/quran-memorizer-ai?include_prereleases&label=version)](https://github.com/aymanelmerzouki/quran-memorizer-ai/releases)
[![Tests](https://img.shields.io/badge/tests-54%2F54%20passing-brightgreen)](./test-app.js)
[![License](https://img.shields.io/github/license/aymanelmerzouki/quran-memorizer-ai)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/aymanelmerzouki/quran-memorizer-ai?style=social)](https://github.com/aymanelmerzouki/quran-memorizer-ai/stargazers)

**[📖 Quick Start](./QUICK_START.md) • [🔨 Build Guide](./BUILD_GUIDE.md) • [🤝 Contributing](./CONTRIBUTING.md) • [🔒 Security](./SECURITY.md)**

**[🇫🇷 Français](./README.md) • 🇬🇧 English**

---

## 🎯 Overview

Professional mobile application combining:
- 📖 **Traditional Memorization** (SRS System, Mutashabihat)
- 🤖 **Artificial Intelligence** (Real-time voice recognition)
- 🎨 **Modern Interface** (Smooth animations, Material Design)
- 📊 **Advanced Tracking** (Statistics, Recommendations)

---

## ✨ Key Features

### Classic Mode
- ✅ Spaced Repetition System (SRS)
- ✅ Mutashabihat database (similar verses)
- ✅ Visual memorization map
- ✅ Personalized progress (SQLite)
- ✅ Integrated audio playback

### AI Trainer Mode 🎤
- ✅ Real-time voice recognition (Groq Whisper)
- ✅ Word-by-word tracking with animations
- ✅ Instant error detection
- ✅ Skipped verse alerts
- ✅ Detailed session statistics
- ✅ Haptic feedback
- ✅ Automatic mutashabihat integration
- ✅ Progress synchronization
- ✅ Personalized recommendations

---

## 📸 Screenshots

*Coming soon - feel free to contribute screenshots!*

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+
- Free Groq API key: https://console.groq.com/

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/aymanelmerzouki/quran-memorizer-ai.git
cd quran-memorizer-ai

# 2. Install dependencies
npm install

# 3. Setup backend (separate terminal)
# Clone the AI tracker backend
git clone https://github.com/yayaiu6/Real-Time-Quran-recitation-tracker-System.git quran-ai-tracker
cd quran-ai-tracker

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env and add your Groq API key

# 4. Start backend
python run.py
# Backend runs on http://localhost:7860

# 5. Start app (in original terminal)
cd ../quran-memorizer-ai
npm start
# Scan QR code with Expo Go app
```

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

---

## 📦 Build APK

```bash
cd quran-memorizer-ai
./prepare-build.sh
```

The script guides you through:
1. Dependency check
2. Backend verification
3. Running tests
4. Building APK (EAS or local)

See [BUILD_GUIDE.md](./BUILD_GUIDE.md) for complete build instructions.

---

## 🏗️ Architecture

### Frontend
- **Framework**: React Native 0.81.5 + Expo 54
- **State**: Context API + AsyncStorage
- **Animations**: React Native Reanimated 4.1.1 (60fps)
- **Real-time**: Socket.IO client
- **Database**: SQLite (expo-sqlite)

### Backend
- **Framework**: Python Flask
- **WebSocket**: Flask-SocketIO
- **AI**: Groq Whisper API
- **Processing**: Real-time audio streaming

### Services
- **AIBackendService**: WebSocket communication
- **AudioRecordingManager**: Audio capture & streaming
- **AIProgressIntegration**: Progress synchronization

---

## 📊 Technical Details

| Component | Technology |
|-----------|-----------|
| **Mobile** | React Native 0.81.5 |
| **UI Framework** | Expo 54 |
| **Animations** | Reanimated 4.1.1 |
| **Backend** | Python 3.8+ Flask |
| **AI** | Groq Whisper API |
| **Database** | SQLite |
| **Real-time** | Socket.IO |
| **Testing** | Custom suite (54 tests) |

**Code Stats**:
- ~15,000 lines of code
- 25+ files created
- 54/54 tests passing (100%)
- 1,459 lines of documentation

---

## 🧪 Testing

```bash
# Frontend tests
node test-app.js

# Backend tests (from quran-ai-tracker)
python test-backend.py
```

All 54 tests must pass before deployment.

---

## 🗺️ Roadmap

### High Priority
- [ ] Offline mode for basic features
- [ ] iOS optimization and testing
- [ ] Performance improvements
- [ ] Multi-language support (Arabic, English, French, Urdu)

### Features
- [ ] Tajweed rules detection
- [ ] Makharij (pronunciation) feedback
- [ ] Session history
- [ ] Progress export/import
- [ ] Cloud backup

### UI/UX
- [ ] Dark mode enhancements
- [ ] Custom themes
- [ ] Tablet optimization
- [ ] Landscape mode
- [ ] Widget support

See [Issues](https://github.com/aymanelmerzouki/quran-memorizer-ai/issues) for full list and discussions.

---

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute

1. **Report Bugs**: Open an [issue](https://github.com/aymanelmerzouki/quran-memorizer-ai/issues)
2. **Suggest Features**: Open an [issue](https://github.com/aymanelmerzouki/quran-memorizer-ai/issues)
3. **Submit Code**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
4. **Improve Docs**: Fix typos, add examples
5. **Share**: Tell others about the project

### Priority Areas

- 🎯 Offline functionality
- 📱 iOS testing and fixes
- 🤖 AI improvements
- 🎨 UI/UX enhancements
- 🌍 Translations
- 📚 Documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## ⭐ Support the Project

If this app helps you in your Quran memorization:

- ⭐ **Star** the repository on GitHub
- 🔄 **Share** with your friends and family
- 🐛 **Report** bugs you encounter
- 💡 **Suggest** improvements
- 🤝 **Contribute** code ([see guide](./CONTRIBUTING.md))
- 🤲 **Make dua** for the contributors

[![GitHub Stars](https://img.shields.io/github/stars/aymanelmerzouki/quran-memorizer-ai?style=for-the-badge&logo=github)](https://github.com/aymanelmerzouki/quran-memorizer-ai/stargazers)

**JazakAllahu Khayran** for your support! 🌟

---

## 📝 License

MIT License - Free to use for personal and educational purposes.

See [LICENSE](./LICENSE) for full details.

---

## 🙏 Acknowledgments

This project combines and builds upon:
- [quran-memorizer](https://github.com/laab69/quran-memorizer) by laab69
- [Real-Time-Quran-recitation-tracker-System](https://github.com/yayaiu6/Real-Time-Quran-recitation-tracker-System) by yayaiu6
- Inspired by [Tarteel AI](https://www.tarteel.ai/)'s research and methodology
- Powered by [Groq](https://groq.com/) AI technology

**JazakAllahu Khayran** to all who contributed! 🌟

---

## 📧 Support

For questions, bugs, or suggestions:
- 📖 Check the documentation
- 🐛 Open an [issue](https://github.com/aymanelmerzouki/quran-memorizer-ai/issues)
- 💬 Start a [discussion](https://github.com/aymanelmerzouki/quran-memorizer-ai/discussions)

---

## 🤲 Dua

May Allah accept this work and make it a means of benefit for the Muslim community.

May it be a source of continuous reward (sadaqah jariyah) for all who contributed, used it to memorize His Book, or shared it with others.

**Ameen.** 🌟

---

**Developed with ❤️ for the Muslim community**

*Last updated: August 2026*
