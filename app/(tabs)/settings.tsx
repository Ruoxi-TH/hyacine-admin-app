import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/auth";
import { useTheme } from "@/theme";
import { useI18n } from "@/i18n";
import { getConfig, updateConfig } from "@/services/api";

interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  from: string;
  has_password: boolean;
}

function GlassField({ label, children }: { label: string; children: React.ReactNode }) {
  const { tokens } = useTheme();
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ color: tokens.mutedText, fontSize: 12, fontWeight: "600", marginBottom: 6 }}>{label}</Text>
      {children}
    </View>
  );
}

function GlassTextInput({ value, onChangeText, ...props }: any) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: tokens.surfaceBorder,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {Platform.OS === "ios" ? (
        <BlurView pointerEvents="none" intensity={20} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={tokens.mutedText}
        style={{ padding: 14, color: tokens.text, fontSize: 15, backgroundColor: "transparent" }}
        {...props}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { token, backendUrl, clearAuth } = useAuthStore();
  const { tokens } = useTheme();
  const { t } = useI18n();
  const [smtp, setSMTP] = useState<SMTPConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [host, setHost] = useState("");
  const [port, setPort] = useState("587");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [from, setFrom] = useState("");

  const fetchConfig = async () => {
    if (!token || !backendUrl) return;
    try {
      const data = await getConfig(backendUrl, token);
      setSMTP(data.smtp);
      setHost(data.smtp.host || "");
      setPort(data.smtp.port?.toString() || "587");
      setUser(data.smtp.user || "");
      setFrom(data.smtp.from || "");
    } catch (err) {
      console.error("Failed to fetch config:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [token, backendUrl]);

  const handleSave = async () => {
    if (!token || !backendUrl) return;
    setSaving(true);
    try {
      await updateConfig(backendUrl, token, {
        smtp: {
          host,
          port: parseInt(port) || 587,
          user,
          password: password || undefined,
          from,
        },
      });
      setEditing(false);
      setPassword("");
      fetchConfig();
    } catch (err) {
      console.error("Failed to save config:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(t("logout"), t("logoutConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("logout"),
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("admin_token");
          await SecureStore.deleteItemAsync("backend_url");
          clearAuth();
          router.replace("/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: tokens.background }}>
        <ActivityIndicator size="large" color={tokens.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 56 }}>
        <Text style={{ color: tokens.text, fontSize: 28, fontWeight: "800" }}>
          {t("settings")}
        </Text>

        <View
          style={{
            marginTop: 24,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: tokens.surfaceBorder,
            borderRadius: tokens.cardRadius,
            padding: 20,
            overflow: "hidden",
          }}
        >
          {Platform.OS === "ios" ? (
            <BlurView pointerEvents="none" intensity={36} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
          ) : null}
          <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, backgroundColor: tokens.isLight ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.42)" }} />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: tokens.text, fontSize: 18, fontWeight: "700" }}>{t("smtpEmail")}</Text>
            {!editing && (
              <Pressable
                onPress={() => setEditing(true)}
                style={{ backgroundColor: `${tokens.accent}20`, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: `${tokens.accent}40` }}
              >
                <Text style={{ color: tokens.accent, fontSize: 12, fontWeight: "700" }}>{t("edit")}</Text>
              </Pressable>
            )}
          </View>

          {editing ? (
            <View style={{ marginTop: 8 }}>
              <GlassField label={t("smtpHost")}>
                <GlassTextInput value={host} onChangeText={setHost} placeholder="smtp.example.com" autoCapitalize="none" />
              </GlassField>
              <GlassField label={t("port")}>
                <GlassTextInput value={port} onChangeText={setPort} placeholder="587" keyboardType="number-pad" />
              </GlassField>
              <GlassField label={t("username")}>
                <GlassTextInput value={user} onChangeText={setUser} placeholder="user@example.com" autoCapitalize="none" keyboardType="email-address" />
              </GlassField>
              <GlassField label={`${t("password")} ${smtp?.has_password ? t("passwordAlreadySet") : ""}`}>
                <GlassTextInput value={password} onChangeText={setPassword} placeholder={smtp?.has_password ? t("leaveEmptyToKeep") : t("enterPassword")} secureTextEntry autoCapitalize="none" />
              </GlassField>
              <GlassField label={t("fromAddress")}>
                <GlassTextInput value={from} onChangeText={setFrom} placeholder="Hyacine Music <noreply@example.com>" autoCapitalize="none" />
              </GlassField>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
                <Pressable
                  onPress={() => { setEditing(false); setPassword(""); fetchConfig(); }}
                  style={{ flex: 1, backgroundColor: "transparent", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: tokens.surfaceBorder, overflow: "hidden" }}
                >
                  <Text style={{ color: tokens.text, fontSize: 14, fontWeight: "600", textAlign: "center" }}>{t("cancel")}</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  disabled={saving}
                  style={{ flex: 1, borderRadius: 12, overflow: "hidden", opacity: saving ? 0.5 : 1 }}
                >
                  <LinearGradient
                    colors={["#203e60", "#6b9cc0", "#274561"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ padding: 14, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
                      {saving ? t("saving") : t("save")}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 16 }}>
              <InfoRow label={t("host")} value={smtp?.host || t("notConfigured")} />
              <InfoRow label={t("port")} value={smtp?.port?.toString() || "-"} />
              <InfoRow label={t("username")} value={smtp?.user || "-"} />
              <InfoRow label={t("password")} value={smtp?.has_password ? t("set") : t("notSet")} valueColor={smtp?.has_password ? "#22C55E" : tokens.mutedText} />
              <InfoRow label={t("from")} value={smtp?.from || "-"} last />
            </View>
          )}
        </View>

        <Pressable
          onPress={handleLogout}
          style={{
            marginTop: 28,
            backgroundColor: "#EF444415",
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: "#EF444440",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#EF4444", fontSize: 16, fontWeight: "700" }}>{t("logout")}</Text>
        </Pressable>

        <View style={{ marginTop: 32, marginBottom: 32, alignItems: "center" }}>
          <Text style={{ color: tokens.mutedText, fontSize: 12 }}>{t("version")}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
  const { tokens } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: last ? 0 : 10 }}>
      <Text style={{ color: tokens.mutedText, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: valueColor || tokens.text, fontSize: 14, flex: 1, textAlign: "right" }}>{value}</Text>
    </View>
  );
}
