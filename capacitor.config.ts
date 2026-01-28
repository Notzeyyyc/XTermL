import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xterml.app',
  appName: 'XTermL',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    allowNavigation: ['127.0.0.1', 'localhost']
  }
};

export default config;
