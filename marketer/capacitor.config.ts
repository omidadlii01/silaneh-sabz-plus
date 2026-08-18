import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.silaneh.sabzplus.marketer',
  appName: 'سیلانه سبز - بازاریابان',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0f5338',
  },
};

export default config;
