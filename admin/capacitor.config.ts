import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.silaneh.sabzplus.manager',
  appName: 'سیلانه سبز - مدیران',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0f5338',
  },
};

export default config;
