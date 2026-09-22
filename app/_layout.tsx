import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@stores/authStore';
import { useEffect } from 'react';

export default function RootLayout() {
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const restoreToken = useAuthStore((s) => s.restoreToken);

  useEffect(() => {
    restoreToken();
  }, []);

  if (isSignedIn) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
