import { Stack } from "expo-router/stack";
import { ThemeProvider } from "@/theme";
import { I18nProvider } from "@/i18n";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </I18nProvider>
    </ThemeProvider>
  );
}