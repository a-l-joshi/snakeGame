import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'snake-game',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Duration in ms for the splash screen to appear (optional)
      launchAutoHide: true, // Automatically hide splash screen
      backgroundColor: '#1E3A5F', // Background color of splash screen
      androidSplashResourceName: 'splash', // Splash screen image resource name for Android (optional)
      splashFullScreen: true,
      splashImmersive: true
    },
  }
};

export default config;
