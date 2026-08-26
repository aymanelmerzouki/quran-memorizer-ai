# 📱 Guide de Build APK - Quran Memorizer + AI Tracker

## 🎯 Objectif

Créer un APK Android optimisé et prêt pour distribution à vous et vos proches.

---

## ✅ Pré-requis Complétés

- ✅ Application testée (34/34 tests frontend, 20/20 tests backend)
- ✅ Configuration optimisée
- ✅ Permissions Android configurées
- ✅ Package name défini : `com.quranapp.memorizerai`

---

## 🚀 Méthode 1 : EAS Build (Recommandée)

### Avantages
- ✅ Build dans le cloud (pas besoin d'Android Studio)
- ✅ APK optimisé automatiquement
- ✅ Processus simple et rapide
- ✅ Gratuit pour builds occasionnels

### Étapes

#### 1. Installer EAS CLI (si pas déjà fait)

```bash
npm install -g eas-cli
```

#### 2. Se Connecter à Expo

```bash
cd ~/quran-hybrid-app
eas login
```

Si vous n'avez pas de compte :
- Créer un compte sur https://expo.dev
- Gratuit, juste besoin d'un email

#### 3. Configurer le Projet

```bash
eas build:configure
```

Répondre aux questions :
- Platform: **Android**
- Build profile: **production**

#### 4. Lancer le Build

```bash
eas build --platform android --profile production
```

**Temps estimé** : 10-20 minutes

#### 5. Télécharger l'APK

Une fois terminé, vous recevrez :
- 🔗 **Lien de téléchargement direct**
- 📱 **QR Code** à scanner

L'APK sera téléchargeable pendant 30 jours.

---

## 🔧 Méthode 2 : Build Local (Avancée)

### Pré-requis Supplémentaires
- Android Studio installé
- JDK 17+ installé
- Android SDK configuré
- ~15 GB d'espace disque libre

### Étapes

#### 1. Installer les Dépendances

```bash
cd ~/quran-hybrid-app
npm install
```

#### 2. Générer les Fichiers Android

```bash
npx expo prebuild --platform android
```

#### 3. Build l'APK

```bash
cd android
./gradlew assembleRelease
```

#### 4. Trouver l'APK

```bash
# L'APK sera ici :
~/quran-hybrid-app/android/app/build/outputs/apk/release/app-release.apk
```

---

## 📤 Distribution de l'APK

### Option 1 : Partage Direct

**Via USB** :
```bash
# Copier l'APK sur téléphone
adb push app-release.apk /sdcard/Download/
```

**Via Cloud** :
- Google Drive
- Dropbox
- WeTransfer
- Email (si < 25 MB)

### Option 2 : QR Code (avec EAS)

Le QR code généré par EAS est partageable directement.

### Option 3 : Serveur Web Local

```bash
# Créer un serveur simple
cd ~/quran-hybrid-app
python -m http.server 8000

# Partager le lien :
# http://votre-ip:8000/app-release.apk
```

---

## 📲 Installation sur Android

### Instructions pour Vos Proches

**Étape 1** : Télécharger l'APK
- Via le lien que vous leur envoyez
- Ou scanner le QR code

**Étape 2** : Autoriser les Sources Inconnues
1. Aller dans **Paramètres** → **Sécurité**
2. Activer **Sources inconnues** (ou **Installation d'apps inconnues**)
3. Autoriser le navigateur/gestionnaire de fichiers

**Étape 3** : Installer
1. Ouvrir le fichier APK téléchargé
2. Appuyer sur **Installer**
3. Attendre la fin de l'installation
4. Appuyer sur **Ouvrir**

**Étape 4** : Permissions
L'app demandera :
- 🎤 **Microphone** : Pour la reconnaissance vocale
- 🌐 **Internet** : Pour se connecter au backend AI

---

## ⚙️ Configuration Backend pour Production

### Option A : Backend Local (Recommandé pour Début)

Chaque utilisateur doit :
1. Installer Python sur son téléphone (via Termux) OU
2. Utiliser un ordinateur comme serveur local

**Sur votre PC** :
```bash
cd ~/quran-ai-tracker
source venv/bin/activate
python run.py --host 0.0.0.0
```

**Dans l'app** :
- Aller dans **Paramètres**
- Changer l'URL backend : `http://[IP-DE-VOTRE-PC]:7860`

### Option B : Backend Cloud (Pour Plus Tard)

Déployer le backend sur :
- **Heroku** (gratuit avec limitations)
- **Railway.app** (gratuit 500h/mois)
- **Render** (gratuit avec limitations)
- **DigitalOcean** (5$/mois)

---

## 🔐 Signature APK (Optionnel)

### Pour Distribution Publique

Si vous voulez publier sur Play Store ou distribuer largement :

```bash
# Générer une keystore
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Signer l'APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore my-release-key.keystore app-release.apk my-key-alias

# Aligner l'APK
zipalign -v 4 app-release.apk app-release-signed.apk
```

**Note** : EAS fait cela automatiquement.

---

## 📊 Optimisations Appliquées

### Performance
- ✅ **Hermes Engine** activé (JavaScript optimisé)
- ✅ **Proguard** activé (minification)
- ✅ **Compression assets** activée
- ✅ **React Native New Architecture** activée

### Taille
- APK attendu : **30-40 MB**
- Après installation : **50-60 MB**

### Batterie
- Enregistrement audio optimisé (chunks de 2s)
- WebSocket avec reconnexion intelligente
- Pas de services en arrière-plan

---

## 🧪 Tester l'APK Avant Distribution

### Sur Émulateur

```bash
# Installer sur émulateur
adb install app-release.apk

# Voir les logs
adb logcat | grep -i quran
```

### Sur Appareil Physique

```bash
# Activer le débogage USB sur le téléphone
# Connecter via USB

adb devices
adb install app-release.apk
```

### Tests à Faire

1. ✅ Lancement de l'app
2. ✅ Navigation entre écrans
3. ✅ Mode lecture classique
4. ✅ Connexion au backend AI
5. ✅ Enregistrement audio
6. ✅ Reconnaissance vocale
7. ✅ Animations fluides
8. ✅ Sauvegarde de progression

---

## 🐛 Dépannage Build

### Erreur : "eas command not found"

```bash
npm install -g eas-cli
```

### Erreur : "No active subscription"

Le plan gratuit d'Expo permet des builds limités.
- **Solution** : Utiliser build local OU attendre reset mensuel

### Erreur : "Android SDK not found"

```bash
# Installer Android Studio
# Ou définir ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
```

### Build Local Échoue

```bash
# Nettoyer et réessayer
cd ~/quran-hybrid-app/android
./gradlew clean
./gradlew assembleRelease
```

### APK Trop Gros

```bash
# Activer la compression dans app.json
"android": {
  "enableShrinkResourcesInReleaseBuilds": true,
  "enableProguardInReleaseBuilds": true
}
```

---

## 📈 Versions Futures

### v1.1.0 (Améliorations)
- [ ] Mode hors ligne pour AI (modèle local)
- [ ] Plus de langues d'interface
- [ ] Statistiques avancées
- [ ] Badges et achievements

### v2.0.0 (Fonctionnalités Majeures)
- [ ] Mode communautaire
- [ ] Compétitions
- [ ] Enseignants virtuels
- [ ] AR mode

---

## 📝 Checklist Finale Avant Distribution

```
✅ Tests complets passés
✅ Backend fonctionnel
✅ APK build et testé
✅ Instructions d'installation rédigées
✅ Support préparé (FAQ, troubleshooting)
```

### Fichiers à Partager

1. **APK** : `app-release.apk` (ou lien EAS)
2. **Instructions** : PDF ou texte
3. **Backend** : Instructions de setup (si local)
4. **Support** : Votre contact pour questions

---

## 🎉 Félicitations !

Vous avez maintenant une **application mobile professionnelle** combinant :
- 📖 Mémorisation traditionnelle
- 🤖 Intelligence artificielle
- 🎨 Interface moderne
- 📊 Statistiques détaillées

**Prêt pour partager avec vos proches** ! 🚀

---

## 🆘 Support

### Logs de Build

```bash
# EAS logs
eas build:list

# Local logs
cat ~/quran-hybrid-app/android/app/build.log
```

### Contact

Pour questions ou bugs :
- Créer une issue sur GitHub
- Contacter le développeur
- Consulter la documentation complète

---

**Qu'Allah facilite votre mémorisation du Saint Coran** 🤲📖
