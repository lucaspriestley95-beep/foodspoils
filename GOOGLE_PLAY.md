# Google Play Store Submission Guide

## Current Status ✅
The FoodSpoils app is TWA-ready with a complete PWA manifest and Capacitor Android scaffolding.

### What's Done
- ✅ **PWA Manifest** (`public/manifest.json`) — Production-ready with all required fields:
  - `id`: com.foodspoils.app
  - `name`/`short_name`: FoodSpoils
  - `display`: standalone
  - `scope`: /
  - `start_url`: /
  - `theme_color`: #22C55E, `background_color`: #041d0c
  - `categories`: ["food", "lifestyle", "utilities"]
  - 11 icon sizes (48–512px), including maskable variants
- ✅ **Icons** — Generated from source `public/app-icon.png` (1024×1024):
  - Standard: 48, 72, 96, 128, 144, 192, 256, 384, 512
  - Maskable: 192, 512 (with safe-zone padding on fresh-500 green background)
- ✅ **Capacitor Android Project** — Scaffolded at `android/`:
  - Package: `com.foodspoils.app`
  - Web directory: `dist/`
  - Gradle build system ready
- ✅ **TWA Asset Links** — `public/.well-known/assetlinks.json` created
  - Links `com.foodspoils.app` to the web origin
  - **Fingerprints must be replaced** with actual signing key SHAs
- ✅ **Service Worker** — `public/sw.js` with stale-while-revalidate caching (v2 cache)
- ✅ **Icon generation script** — `scripts/generate-icons.js` for regenerating all sizes

## Remaining Steps for Play Store Submission

### 1. Generate Signing Key
```bash
keytool -genkey -v -keystore foodspoils-upload.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload

# Get SHA-256 fingerprints
keytool -list -v -keystore foodspoils-upload.jks -alias upload | grep SHA256
```

### 2. Update assetlinks.json
Replace the placeholder fingerprints in `public/.well-known/assetlinks.json` with:
- Your upload key SHA-256
- Google Play App Signing key SHA-256 (from Play Console after first upload)

Then rebuild and redeploy:
```bash
bun run build
# Deploy dist/ to hosting
```

### 3. Build the Android App Bundle (AAB)
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

Create `android/keystore.properties`:
```
storeFile=foodspoils-upload.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=upload
keyPassword=YOUR_KEY_PASSWORD
```

### 4. Google Play Console Checklist
- [ ] Create developer account ($25 one-time fee)
- [ ] Create app: `com.foodspoils.app`
- [ ] Upload AAB
- [ ] Complete store listing (name, descriptions, screenshots, feature graphic, icon)
- [ ] Set content rating (questionnaire)
- [ ] Set pricing: Free
- [ ] Accept content guidelines
- [ ] Roll out to production

### 5. Suggested Store Listing
**Short Description (80 chars):**
Track pantry freshness, reduce food waste, and save money. Scan, track, eat!

**Full Description:**
FoodSpoils helps you track what's in your fridge and pantry, know when items expire, and get timely reminders before food goes bad.

Features: Barcode scanning, expiry tracking, smart reminders, "Use It Up" recipes, monthly waste reports, household sharing, dark theme, PWA install.

Free tier: 15 items, manual entry. Premium: $4.99/mo or $39.99/yr — unlimited items, barcode scan, recipes.

## Icon Regeneration
```bash
node scripts/generate-icons.js      # PWA icons
npx @capacitor/assets generate      # Native iOS/Android icons
bun run build                        # Rebuild dist/
```
