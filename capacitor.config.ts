import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aispeakingobject.app',
  appName: 'Talking Objects',
  webDir: 'public',
  server: {
    url: 'https://talkingobjectsandroid.vercel.app',
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
