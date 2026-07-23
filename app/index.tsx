import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/auth";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = await SecureStore.getItemAsync("admin_token");
      const savedBackendUrl = await SecureStore.getItemAsync("backend_url");
      
      if (savedToken && savedBackendUrl) {
        setToken(savedToken, savedBackendUrl);
        router.replace("/(tabs)");
      } else if (savedBackendUrl) {
        router.replace("/login");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0f1a" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0f1a" }}>
    </View>
  );
}