import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.happykopi.app',
  appName: 'happykopi-app',
  webDir: 'dist/happykopiApp/browser',
  server: {
    url: "http://192.168.123.222:4200",
    cleartext: true
  }
};

export default config;
