import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { OnboardingProvider } from './context/OnboardingContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <OnboardingProvider>

      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >

        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="onboarding/journey"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="onboarding/profile"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="onboarding/academic"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="onboarding/personality"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />

      </Stack>

    </OnboardingProvider>
  );
}