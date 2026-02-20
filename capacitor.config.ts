import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aispeakingobject.app',
  appName: 'AI Speaking Object',
  webDir: 'public',
  server: {
    url: 'https://4b25-76-68-130-59.ngrok-free.app',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      overlaysWebView: true,
      style: 'DARK',
      backgroundColor: '#00000000', // Transparent
    },
  },
};

export default config;
