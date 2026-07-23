import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/theme";

interface ThemedScreenProps {
  children: React.ReactNode;
}

export function ThemedScreen({ children }: ThemedScreenProps): React.JSX.Element {
  const { tokens } = useTheme();

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
      {children}
    </View>
  );
}
