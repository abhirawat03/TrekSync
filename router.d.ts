// router.d.ts

import { Router } from 'expo-router';

declare module 'expo-router' {
  interface Router {
    query: {
      source?: string;
      destination?: string;
    };
  }
}
