import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/auth";

export default function SettingsScreen() {
  const { token, backendUrl, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("admin_token");
          clearAuth();
          router.replace("/");
        },
      },
    ]);
  };

  const handleChangeBackend = () => {
    Alert.alert(
      "Change Backend URL",
      "Enter new backend URL",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f1a", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 40 }}>
        Settings
      </Text>

      <View style={{ marginTop: 24 }}>
        <Text style={{ color: "#888", fontSize: 12 }}>Backend URL</Text>
        <Text style={{ color: "#fff", fontSize: 14, marginTop: 4 }}>{backendUrl}</Text>
      </View>

      <View style={{ marginTop: 32 }}>
        <Pressable
          onPress={handleLogout}
          style={{
            backgroundColor: "#EF4444",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700", textAlign: "center" }}>
            Logout
          </Text>
        </Pressable>
      </View>

      <View style={{ marginTop: "auto", paddingBottom: 32 }}>
        <Text style={{ color: "#888", fontSize: 12, textAlign: "center" }}>
          Hyacine Admin v1.0.0
        </Text>
      </View>
    </View>
  );
}