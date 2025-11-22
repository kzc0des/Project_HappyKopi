import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.happykopi.app',
  appName: 'HappyKopi',
  webDir: 'dist/happykopiApp/browser',
  server: {
    url: "http://192.168.1.20:4200",
    cleartext: true
  }
};

export default config;
