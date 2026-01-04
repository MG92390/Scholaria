# Génération d'assets temporaires pour Scholaria

## Utilisez ce script PowerShell pour créer des assets de base :

```powershell
# Créer des fichiers PNG temporaires avec couleur unie
$bytes = [System.Convert]::FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")
[System.IO.File]::WriteAllBytes("./assets/icon.png", $bytes)
[System.IO.File]::WriteAllBytes("./assets/adaptive-icon.png", $bytes)
[System.IO.File]::WriteAllBytes("./assets/splash.png", $bytes)
[System.IO.File]::WriteAllBytes("./assets/favicon.png", $bytes)
```

## OU copiez des images existantes :

```bash
# Si vous avez des images dans d'autres dossiers
copy "chemin/vers/votre/icone.png" "./assets/icon.png"
copy "chemin/vers/votre/icone.png" "./assets/adaptive-icon.png"
copy "chemin/vers/votre/splash.png" "./assets/splash.png"
copy "chemin/vers/votre/favicon.png" "./assets/favicon.png"
```

## Outils recommandés pour créer vos assets :

1. **Canva** (gratuit) : Templates pour icônes d'app
2. **Figma** (gratuit) : Design professionnel
3. **Adobe Express** : Templates pour apps
4. **AppIcon.co** : Génération automatique de toutes les tailles

## Spécifications exactes :

- **icon.png** : 1024x1024, fond opaque, design simple
- **adaptive-icon.png** : 1024x1024, zone safe de 768px
- **splash.png** : 1242x2436, logo centré sur fond coloré
- **favicon.png** : 48x48, version mini de votre icône
