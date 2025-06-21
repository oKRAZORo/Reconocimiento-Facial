import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'recoface',
  webDir: 'www',
  server: {
    cleartext: true // necesario si tu backend Flask corre en HTTP
  }
};

export default config;
