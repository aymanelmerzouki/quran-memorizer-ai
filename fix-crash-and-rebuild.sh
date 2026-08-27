#!/bin/bash

echo "🔧 FIX CRASH AU DÉMARRAGE - Application Quran Memorizer AI"
echo "============================================================"
echo ""

cd ~/quran-hybrid-app

echo "📋 Modifications appliquées :"
echo ""
echo "✅ 1. Désactivation New Architecture (cause de crash)"
echo "✅ 2. Version mise à jour → 1.0.1"
echo "✅ 3. Permissions Android étendues"
echo "✅ 4. EdgeToEdge désactivé (problème compatibilité)"
echo "✅ 5. VersionCode incrémenté → 3"
echo ""

echo "📦 Changements dans app.json :"
cat << 'EOF'
{
  "newArchEnabled": false,        // ❌ était true
  "version": "1.0.1",            // ⬆️  était 1.0.0
  "versionCode": 3,              // ⬆️  était 1
  "edgeToEdgeEnabled": false,    // ❌ était true
  "permissions": [               // ➕ ajout stockage
    "RECORD_AUDIO",
    "INTERNET",
    "ACCESS_NETWORK_STATE",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE"
  ]
}
EOF

echo ""
echo "🎯 Cause Probable du Crash :"
echo ""
echo "La New Architecture (Fabric/TurboModules) de React Native"
echo "n'est pas stable avec certains modules natifs utilisés."
echo ""
echo "Solution : Désactivation → Mode classique (plus stable)"
echo ""

read -p "🚀 Lancer le nouveau build maintenant ? (y/n) " -n 1 -r
echo
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "📝 Commit des changements..."
    git add app.json
    git commit -m "🐛 Fix: Disable new arch and add permissions for crash fix"
    git push
    
    echo ""
    echo "🔨 Lancement du build EAS..."
    echo ""
    
    EAS_BUILD_NO_EXPO_GO_WARNING=true eas build --platform android --profile production
    
    echo ""
    echo "✅ Build lancé !"
    echo ""
    echo "⏱️  Temps estimé : 20-25 minutes"
    echo "📊 Suivre : https://expo.dev/accounts/ymn02/projects/quran-memorizer-ai/builds"
    echo ""
else
    echo ""
    echo "ℹ️  Vous pouvez lancer le build manuellement :"
    echo ""
    echo "   cd ~/quran-hybrid-app"
    echo "   git add app.json"
    echo "   git commit -m '🐛 Fix crash'"
    echo "   git push"
    echo "   eas build --platform android --profile production"
    echo ""
fi

echo ""
echo "📚 Documentation créée : CRASH_FIX.md"
