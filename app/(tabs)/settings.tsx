import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useAuthStore } from "@/store/auth";
import { getConfig, updateConfig } from "@/services/api";

interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  from: string;
  has_password: boolean;
}

export default function SettingsScreen() {
  const { token, backendUrl } = useAuthStore();
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0f1a" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0f0f1a", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 40 }}>
        Settings
      </Text>

      <View style={{ marginTop: 24 }}>
        <Text style={{ color: "#888", fontSize: 12 }}>Backend URL</Text>
        <Text style={{ color: "#fff", fontSize: 14, marginTop: 4 }}>{backendUrl}</Text>
      </View>

      <View style={{ marginTop: 32 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>SMTP Email</Text>
          {!editing && (
            <Pressable
              onPress={() => setEditing(true)}
              style={{ backgroundColor: "#7C3AED", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>Edit</Text>
            </Pressable>
          )}
        </View>

        <View style={{ backgroundColor: "#1a1a2e", borderRadius: 12, padding: 16, marginTop: 12 }}>
          {editing ? (
            <>
              <Text style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>SMTP Host</Text>
              <TextInput
                value={host}
                onChangeText={setHost}
                placeholder="smtp.example.com"
                placeholderTextColor="#666"
                autoCapitalize="none"
                style={{ backgroundColor: "#0f0f1a", borderRadius: 8, padding: 12, color: "#fff", fontSize: 14 }}
              />

              <Text style={{ color: "#888", fontSize: 12, marginBottom: 4, marginTop: 12 }}>Port</Text>
              <TextInput
                value={port}
                onChangeText={setPort}
                placeholder="587"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                style={{ backgroundColor: "#0f0f1a", borderRadius: 8, padding: 12, color: "#fff", fontSize: 14 }}
              />

              <Text style={{ color: "#888", fontSize: 12, marginBottom: 4, marginTop: 12 }}>Username</Text>
              <TextInput
                value={user}
                onChangeText={setUser}
                placeholder="user@example.com"
                placeholderTextColor="#666"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ backgroundColor: "#0f0f1a", borderRadius: 8, padding: 12, color: "#fff", fontSize: 14 }}
              />

              <Text style={{ color: "#888", fontSize: 12, marginBottom: 4, marginTop: 12 }}>
                Password {smtp?.has_password ? "(already set)" : ""}
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={smtp?.has_password ? "Leave empty to keep current" : "Enter password"}
                placeholderTextColor="#666"
                secureTextEntry
                autoCapitalize="none"
                style={{ backgroundColor: "#0f0f1a", borderRadius: 8, padding: 12, color: "#fff", fontSize: 14 }}
              />

              <Text style={{ color: "#888", fontSize: 12, marginBottom: 4, marginTop: 12 }}>From Address</Text>
              <TextInput
                value={from}
                onChangeText={setFrom}
                placeholder="Hyacine Music <noreply@example.com>"
                placeholderTextColor="#666"
                autoCapitalize="none"
                style={{ backgroundColor: "#0f0f1a", borderRadius: 8, padding: 12, color: "#fff", fontSize: 14 }}
              />

              <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
                <Pressable
                  onPress={() => {
                    setEditing(false);
                    setPassword("");
                    fetchConfig();
                  }}
                  style={{ flex: 1, backgroundColor: "#374151", borderRadius: 8, padding: 12 }}
                >
                  <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  disabled={saving}
                  style={{ flex: 1, backgroundColor: "#7C3AED", borderRadius: 8, padding: 12, opacity: saving ? 0.5 : 1 }}
                >
                  <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
                    {saving ? "Saving..." : "Save"}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: "#888", fontSize: 12 }}>Host</Text>
                <Text style={{ color: "#fff", fontSize: 14 }}>{smtp?.host || "Not configured"}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: "#888", fontSize: 12 }}>Port</Text>
                <Text style={{ color: "#fff", fontSize: 14 }}>{smtp?.port || "-"}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: "#888", fontSize: 12 }}>Username</Text>
                <Text style={{ color: "#fff", fontSize: 14 }}>{smtp?.user || "-"}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: "#888", fontSize: 12 }}>Password</Text>
                <Text style={{ color: smtp?.has_password ? "#22C55E" : "#888", fontSize: 14 }}>
                  {smtp?.has_password ? "Set" : "Not set"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: "#888", fontSize: 12 }}>From</Text>
                <Text style={{ color: "#fff", fontSize: 14, flex: 1, textAlign: "right" }}>
                  {smtp?.from || "-"}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={{ marginTop: 32, marginBottom: 32 }}>
        <Text style={{ color: "#888", fontSize: 12, textAlign: "center" }}>
          Hyacine Admin v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}