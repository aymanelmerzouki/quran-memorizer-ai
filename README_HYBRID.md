# 🕌 Quran Memorizer + AI Tracker - Application Hybride

Application mobile React Native combinant mémorisation du Coran et reconnaissance vocale en temps réel avec IA.

## ✨ Fonctionnalités

### Du Projet Original (Quran Memorizer)
- ✅ **Système SRS** (Spaced Repetition System) pour optimiser la révision
- ✅ **Base mutashabihat** - Détection des versets similaires
- ✅ **Carte de mémorisation** visuelle
- ✅ **Progression personnalisée** avec SQLite
- ✅ **Interface en arabe** avec police Amiri

### Nouveau : Mode AI Trainer 🎤
- ✅ **Reconnaissance vocale en temps réel** (Groq Whisper)
- ✅ **Suivi mot-à-mot** avec alignement Tarteel
- ✅ **Détection d'erreurs** instantanée
- ✅ **Alertes versets sautés** (sequence detection)
- ✅ **Statistiques de session** (correct/incorrect/sautés)
- ✅ **Feedback haptique** (vibrations)
- ✅ **Intégration mutashabihat** - Détecte automatiquement les versets similaires aux erreurs
- ✅ **Synchronisation progression** - Met à jour automatiquement votre progression
- ✅ **Recommandations intelligentes** - Suggère les versets à réviser
- ✅ **Résumé de session** - Analyse détaillée après chaque entraînement

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   React Native App (Mobile Interface)   │
├─────────────────────────────────────────┤
│  📱 Screens:                            │
│    • Dashboard                          │
│    • AI Trainer (NOUVEAU)               │
│    • Surah List                         │
│    • Ayah Display                       │
│    • Memorization Map                   │
│                                         │
│  🔧 Services:                           │
│    • AIBackendService (WebSocket)       │
│    • AudioRecordingManager              │
│    • AppStore (State Management)        │
└─────────────────────────────────────────┘
              ↕ WebSocket (Socket.IO)
┌─────────────────────────────────────────┐
│   Python Flask Backend (AI Engine)      │
├─────────────────────────────────────────┤
│  • Groq Whisper ASR                     │
│  • Tarteel Alignment Algorithm          │
│  • Sequence Analyzer                    │
│  • 77,491 mots indexés                  │
│  • 6,236 versets Coran                  │
└─────────────────────────────────────────┘
```

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Python 3.8+
- FFmpeg
- Groq API key (gratuite)

### 1. Backend Python (AI Engine)

```bash
cd ~/quran-ai-tracker

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate

# Installer dépendances
pip install Flask Flask-SocketIO flask-cors python-dotenv groq ffmpeg-python python-Levenshtein eventlet

# Configurer .env
echo "GROQ_API_KEY=votre_cle_groq" > .env

# Lancer le serveur
python run.py
```

Le backend sera accessible sur `http://localhost:7860`

### 2. Application React Native

```bash
cd ~/quran-hybrid-app

# Installer dépendances
npm install

# Lancer sur Android
npx expo run:android

# Ou sur iOS
npx expo run:ios
```

## 🎯 Utilisation

### Mode Lecture Classique
1. Ouvrir l'app
2. Choisir "خريطة الحفظ" ou "آية عشوائية"
3. Réviser normalement avec système SRS

### Mode AI Trainer 🎤
1. **S'assurer que le backend Python tourne** sur localhost:7860
2. Cliquer sur "🎤 تدريب بالذكاء الاصطناعي"
3. Appuyer sur "ابدأ القراءة" pour commencer
4. Réciter à voix haute
5. **Voir en temps réel** :
   - Mots surlignés en vert (correct) ou rouge (incorrect)
   - Statistiques : mots corrects/incorrects/versets sautés
   - Alertes si vous sautez des versets
6. **Terminer la session** :
   - Appuyer sur "✓ إنهاء"
   - Voir le résumé détaillé avec :
     - Score global et par verset
     - Versets similaires (mutashabihat) liés aux erreurs
     - Recommandations personnalisées
   - Sauvegarder dans le système de progression

### Fonctionnalités Avancées

#### Synchronisation Automatique
- Les versets récités avec >85% de précision sont **automatiquement marqués comme mémorisés**
- Les versets <60% sont marqués pour révision
- Intégration complète avec le système SRS existant

#### Détection Mutashabihat
- Analyse automatique des erreurs
- Identifie les phrases similaires dans d'autres versets
- Affiche les occurrences et contextes
- Aide à comprendre les patterns d'erreurs

## 🔧 Configuration

### Backend (`quran-ai-tracker/backend/config.py`)
```python
# Reconnaissance vocale
ASR_BACKEND = "whisper"  # "whisper" (Groq) ou "nemo" (local)

# Seuils de détection
WORD_SIMILARITY_THRESHOLD = 0.7  # Sensibilité mots (0.4-0.9)
SEGMENT_SCORE_THRESHOLD = 0.5    # Sensibilité segments
```

### Frontend (React Native)
```javascript
// src/services/AIBackendService.js
this.backendUrl = 'http://localhost:7860'; // Changer si backend distant
```

## 📱 Build APK

### Via EAS (Recommandé)
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

### Build Local
```bash
npx expo run:android --variant release
# APK dans: android/app/build/outputs/apk/release/
```

## 🎨 Personnalisation

### Changer le nom de l'app
`app.json` :
```json
{
  "expo": {
    "name": "حافظ - AI Edition",
    "slug": "quran-memorizer-ai",
    "android": {
      "package": "com.votreorg.quranmemorizerai"
    }
  }
}
```

### Ajouter des fonctionnalités mutashabihat à l'AI
Modifier `src/screens/AITrainerScreen.jsx` pour intégrer la base de données mutashabihat du Projet 1.

## 🐛 Dépannage

### Backend ne se connecte pas
```bash
# Vérifier que le serveur tourne
curl http://localhost:7860

# Voir les logs
cd ~/quran-ai-tracker
source venv/bin/activate
python run.py
```

### Erreur "Audio permission not granted"
- Android : Vérifier permissions dans `app.json`
- iOS : Ajouter `NSMicrophoneUsageDescription`

### Reconnaissance vocale lente
- Vérifier connexion internet (Groq API)
- Ou passer à NeMo local (nécessite GPU)

## 📊 Comparaison des Backends ASR

| Backend | Vitesse | Qualité | Offline | Coût |
|---------|---------|---------|---------|------|
| Groq Whisper | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | ❌ | Gratuit (14k req/jour) |
| NeMo Local | ⚡⚡ | ⭐⭐⭐⭐ | ✅ | Gratuit (GPU requis) |

## 🤝 Contribution

Ce projet fusionne :
- [quran-memorizer](https://github.com/laab69/quran-memorizer) par laab69
- [Real-Time-Quran-recitation-tracker-System](https://github.com/yayaiu6/Real-Time-Quran-recitation-tracker-System) par yayaiu6

Inspiré par la recherche de [Tarteel AI](https://tarteel.ai/blog).

## 📄 License

MIT License - Libre d'utilisation pour projets personnels et éducatifs.

## 🙏 Remerciements

- **Tarteel AI** pour l'algorithme d'alignement
- **Groq** pour l'API Whisper gratuite
- **Communauté React Native** et **Expo**
- **Tous les contributeurs** des projets sources

---

**Développé avec ❤️ pour faciliter la mémorisation du Saint Coran**
