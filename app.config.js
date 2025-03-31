import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  expo: {
    name: "TrekSync",
    slug: "TrekSync",
    extra: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      GOOGLE_GEMINI_API: process.env.GOOGLE_GEMINI_API,
      router: {
        origin: false
      },
      eas: {
        projectId: "f5d3ddd5-5fda-4497-af99-238b85675864"
      }
    },
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/app-icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/app-icon.png",
      resizeMode: "contain",
      backgroundColor: "#25292e"
    },
    newArchEnabled: true,
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
        
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ],
      softwareKeyboardLayoutMode: "pan",
      package: "com.abhirawat8076.TrekSync"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    }
  }
});
