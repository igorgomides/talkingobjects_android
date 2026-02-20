# AI Speaking Object - Android App Setup

This project uses [Capacitor](https://capacitorjs.com/) to wrap the Next.js web application into a native Android app.

## Prerequisites
1.  **Node.js** (Installed)
2.  **Android Studio** (Required to build the APK)

## How to Run (Development)

1.  **Start the Next.js Server**:
    ```bash
    npm run dev
    ```
    Ensure it's running on port 3000.

2.  **Open Android Studio**:
    ```bash
    npx cap open android
    ```

3.  **Run on Emulator**:
    -   In Android Studio, select a device (e.g., Pixel 4 API 30).
    -   Click the **Run** button (Green Play Icon).
    -   *Note*: The app is configured to point to `http://10.0.2.2:3000`, which is the Android Emulator's alias for `localhost`.

## How to Run (Physical Device)

1.  Find your computer's local IP address (e.g., `192.168.1.50`).
2.  Update `capacitor.config.ts`:
    ```typescript
    server: {
      url: 'http://192.168.1.50:3000', // Update this IP
      cleartext: true
    }
    ```
3.  Sync the changes:
    ```bash
    npx cap sync
    ```
4.  Run on your device via Android Studio.

## How to Build for Production (APK)

1.  Deploy your Next.js app to a public URL (e.g., Vercel, Railway).
2.  Update `capacitor.config.ts` with the production URL:
    ```typescript
    server: {
      url: 'https://your-app-domain.com',
      cleartext: false
    }
    ```
3.  Sync:
    ```bash
    npx cap sync
    ```
4.  Open Android Studio (`npx cap open android`).
5.  Go to **Build > Build Bundle(s) / APK(s) > Build APK**.
