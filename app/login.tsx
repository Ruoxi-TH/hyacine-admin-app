import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/auth";
import { login } from "@/services/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const backendUrl = await SecureStore.getItemAsync("backend_url");
      if (!backendUrl) {
        Alert.alert("Error", "Backend URL not configured");
        return;
      }

      const result = await login(backendUrl, email, password);
      if (result.token) {
        await SecureStore.setItemAsync("admin_token", result.token);
        setToken(result.token, backendUrl);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", result.message || "Login failed");
      }
    } catch (err) {
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f1a", padding: 24 }}>
      <View style={{ marginTop: 100 }}>
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", textAlign: "center" }}>
          Hyacine Admin
        </Text>
        <Text style={{ color: "#888", fontSize: 14, textAlign: "center", marginTop: 8 }}>
          Sign in to manage your server
        </Text>
      </View>

      <View style={{ marginTop: 48 }}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            backgroundColor: "#1a1a2e",
            borderRadius: 12,
            padding: 16,
            color: "#fff",
            fontSize: 16,
          }}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            backgroundColor: "#1a1a2e",
            borderRadius: 12,
            padding: 16,
            color: "#fff",
            fontSize: 16,
            marginTop: 12,
          }}
        />
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: "#7C3AED",
            borderRadius: 12,
            padding: 16,
            marginTop: 24,
            opacity: loading ? 0.5 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700", textAlign: "center" }}>
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}