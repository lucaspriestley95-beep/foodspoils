# FoodSpoils Publishing & Submission Guide

This document outlines the step-by-step process for the owner to package, build, and submit **FoodSpoils** to both the Apple App Store and Google Play Store using the Capacitor setup we have configured.

---

## 📱 General App Information

- **App Name:** FoodSpoils
- **Bundle ID / Package Name:** `com.foodspoils.app`
- **Current Version:** `1.0.0`
- **Build Version:** `1`

---

## 🍏 Apple App Store Submission Guide

To publish FoodSpoils on the Apple App Store, follow these steps.

### Prerequisites
1. **Apple Developer Account:** An active Apple Developer membership ($99/year). Register at [developer.apple.com](https://developer.apple.com/).
2. **Mac Computer:** macOS is required to run Xcode and build native iOS binaries.
3. **Xcode:** Installed from the Mac App Store.

### 1. Build and Sync the Web Code
On your machine, package the latest web build and sync it into the native Xcode project:
```bash
# Build the production-ready web app
npm run build

# Sync built assets and configurations into the iOS project
npx cap sync ios
```

### 2. Configure Code Signing in Xcode
1. Open the iOS project in Xcode:
   ```bash
   npx cap open ios
   ```
2. In Xcode, select the root **App** project on the left sidebar.
3. Select the **App** target and navigate to the **Signing & Capabilities** tab.
4. Check **Automatically manage signing**.
5. Select your Apple Developer **Team** from the dropdown menu to generate signing certificates and provisioning profiles.

### 3. Generate the Archive
1. Set the target device to **Any iOS Device (arm64)** in the top device menu.
2. In the menu bar, go to **Product** > **Archive**.
3. Once the archive is created, the Organizer window will appear.

### 4. Upload to App Store Connect
1. In the Organizer window, click **Distribute App**.
2. Choose **App Store Connect** and click **Next**.
3. Choose **Upload** to send the build directly to Apple's servers.
4. Follow the prompts to configure App Store options and click **Upload**.

### 5. Finalize App Store Connect Listing
1. Log in to [appstoreconnect.apple.com](https://appstoreconnect.apple.com/).
2. Click **My Apps** and select **FoodSpoils** (or create a new app listing with Bundle ID `com.foodspoils.app`).
3. Complete the app listing metadata:
   - **App Store Screenshots:** Required sizes: iPhone 6.5" Display (e.g., iPhone 11/12/13/14 Pro Max) and 5.5" Display (e.g., iPhone 8 Plus).
   - **Listing Copy:** App Title, Subtitle, Promotional Text, Description, Keywords.
   - **URLs:** Support URL (e.g., `https://foodspoils.app/support`) and Privacy Policy URL.
4. Under **Build**, select the build you uploaded from Xcode.
5. Click **Submit for Review**.

---

## 🤖 Google Play Store Submission Guide

To publish FoodSpoils on the Google Play Store, follow these steps.

### Prerequisites
1. **Google Play Developer Account:** A one-time registration fee of $25. Register at [play.google.com/console](https://play.google.com/console).
2. **Java Development Kit (JDK):** JDK 17+ is required on the build machine.
3. **Android Studio:** Required to build release APKs / App Bundles and manage Android SDKs.

### 1. Build and Sync the Web Code
Package the latest web build and sync it into the native Android project:
```bash
# Build the production-ready web app
npm run build

# Sync built assets and configurations into the Android project
npx cap sync android
```

### 2. Generate a Signed Release Bundle (AAB)
Google Play requires publishing apps in the **Android App Bundle (.aab)** format.
1. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```
2. In Android Studio, wait for Gradle sync to complete.
3. Go to **Build** > **Generate Signed Bundle / APK...** in the top menu.
4. Select **Android App Bundle** and click **Next**.
5. Create or select an existing **Keystore** (keep this key extremely secure; you will need it for all future app updates).
6. Fill in the key alias, password, and certificate details. Click **Next**.
7. Select the **release** build variant and click **Create**.
8. Android Studio will generate the signed `.aab` file in `android/app/release/app-release.aab`.

### 3. Set Up Your App in Google Play Console
1. Log in to [play.google.com/console](https://play.google.com/console).
2. Click **Create app** and enter details: App name, Default language, App/Game, Free/Paid.
3. Complete the initial dashboard tasks:
   - Set up **Privacy Policy** URL.
   - Complete the **Content Rating** questionnaire.
   - Configure **Target Audience** (e.g., ages 18+ or families).
4. Navigate to **Store presence** > **Main store listing** and fill out:
   - App Name, Short Description, and Full Description.
   - **App Icon:** High-res PNG (512x512).
   - **Feature Graphic:** PNG (1024x500).
   - **Screenshots:** At least 2-4 screenshots of the app running on phone/tablet displays.

### 4. Create a Release and Publish
1. In the Play Console sidebar, go to **Release** > **Production**.
2. Click **Create new release**.
3. Upload the signed `.aab` file from `android/app/release/app-release.aab`.
4. Add release notes (e.g., "Initial release of FoodSpoils - reduce food waste and track expiries!").
5. Click **Save** > **Review release** > **Start roll-out to Production**.

---

## 🎨 Asset Guidelines

To ensure your app listings are highly professional and get approved quickly:

| Asset Type | Platform | Dimensions | Format | Details |
| :--- | :--- | :--- | :--- | :--- |
| App Icon | iOS App Store | 1024x1024 | PNG | No alpha/transparency allowed. |
| App Icon | Google Play | 512x512 | PNG | High-res with alpha allowed. |
| Feature Graphic | Google Play | 1024x500 | PNG | Prominently displays brand, colors, and tagline. |
| Screenshots | iPhone 6.5" | 1242x2688 | PNG | Max 10. Show key screens (Dashboard, Scanning). |
| Screenshots | iPhone 5.5" | 1242x2208 | PNG | Max 10. Required for older iPhone support. |
| Screenshots | Android Phone | Min 320px to Max 3840px | PNG | Ratio 16:9 or 9:16. At least 2 required. |

*Note: Custom icons and splash screens are already generated and compiled directly inside your native projects in `android/app/src/main/res` and `ios/App/App/Assets.xcassets`.*
