import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/auth";
import { useTheme } from "@/theme";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const { setToken } = useAuthStore();
  const { tokens } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = await SecureStore.getItemAsync("admin_token");
      const savedBackendUrl = await SecureStore.getItemAsync("backend_url");

      if (savedToken && savedBackendUrl) {
        setToken(savedToken, savedBackendUrl);
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: tokens.background }}>
        <ActivityIndicator size="large" color={tokens.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }} />
  );
}
