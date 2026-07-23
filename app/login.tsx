import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View, ScrollView, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/auth";
import { useTheme } from "@/theme";
import { useI18n } from "@/i18n";
import { login } from "@/services/api";

export default function LoginScreen() {
  const [backendUrl, setBackendUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuthStore();
  const { tokens } = useTheme();
  const { t } = useI18n();

  const handleLogin = async () => {
    if (!backendUrl.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t("loginFailed"), t("enterEmailAndPassword"));
      return;
    }

    setLoading(true);
    try {
      const url = backendUrl.trim().replace(/\/+$/, "");
      const result = await login(url, email, password);
      if (result.token) {
        await SecureStore.setItemAsync("admin_token", result.token);
        await SecureStore.setItemAsync("backend_url", url);
        setToken(result.token, url);
        router.replace("/(tabs)");
      } else {
        Alert.alert(t("loginFailed"), result.message || t("loginFailed"));
      }
    } catch (err) {
      Alert.alert(t("networkError"), t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <LinearGradient
        pointerEvents="none"
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        colors={
          tokens.isLight
            ? ["#cfe5ff", "#f5f8ff", "#d9ecff", "#f8f4ff"]
            : [tokens.background, "#162745", "#151a33", tokens.backgroundSecondary]
        }
        locations={[0, 0.34, 0.68, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        pointerEvents="none"
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        colors={[`${tokens.accent}38`, "#ffffff00", "#8bd5ff24", "#ffffff10"]}
        locations={[0, 0.36, 0.72, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ marginTop: 100, alignItems: "center" }}>
          <Text style={{ color: tokens.text, fontSize: 28, fontWeight: "800", textAlign: "center" }}>
            {t("adminTitle")}
          </Text>
          <Text style={{ color: tokens.mutedText, fontSize: 14, textAlign: "center", marginTop: 8 }}>
            {t("signInToManage")}
          </Text>
        </View>

        <View style={{ marginTop: 48 }}>
          <View
            style={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: tokens.surfaceBorder,
              borderRadius: 14,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            {Platform.OS === "ios" ? (
              <BlurView pointerEvents="none" intensity={28} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
            ) : null}
            <TextInput
              placeholder={t("backendUrl")}
              placeholderTextColor={tokens.mutedText}
              value={backendUrl}
              onChangeText={setBackendUrl}
              autoCapitalize="none"
              keyboardType="url"
              style={{ padding: 16, color: tokens.text, fontSize: 16, backgroundColor: "transparent" }}
            />
          </View>

          <View
            style={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: tokens.surfaceBorder,
              borderRadius: 14,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            {Platform.OS === "ios" ? (
              <BlurView pointerEvents="none" intensity={28} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
            ) : null}
            <TextInput
              placeholder={t("email")}
              placeholderTextColor={tokens.mutedText}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ padding: 16, color: tokens.text, fontSize: 16, backgroundColor: "transparent" }}
            />
          </View>

          <View
            style={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: tokens.surfaceBorder,
              borderRadius: 14,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            {Platform.OS === "ios" ? (
              <BlurView pointerEvents="none" intensity={28} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
            ) : null}
            <TextInput
              placeholder={t("password")}
              placeholderTextColor={tokens.mutedText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              style={{ padding: 16, color: tokens.text, fontSize: 16, backgroundColor: "transparent" }}
            />
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={{ borderRadius: 14, overflow: "hidden", marginTop: 12, opacity: loading ? 0.5 : 1 }}
          >
            <LinearGradient
              colors={["#203e60", "#6b9cc0", "#274561"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 16, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                {loading ? t("signingIn") : t("signIn")}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
