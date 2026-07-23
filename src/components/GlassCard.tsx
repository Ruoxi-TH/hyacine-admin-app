import { Platform, View, type ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/theme";

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "", style, ...props }: GlassCardProps): React.JSX.Element {
  const { tokens } = useTheme();

  return (
    <View
      className={`overflow-hidden border ${className}`}
      style={[
        {
          backgroundColor: "transparent",
          borderColor: tokens.isLight ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.28)",
          borderRadius: tokens.cardRadius,
          shadowColor: "#24364f",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 0,
        },
        style,
      ]}
      {...props}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          pointerEvents="none"
          intensity={48}
          tint={tokens.isLight ? "light" : "dark"}
          className="absolute inset-0"
          style={{ backgroundColor: "transparent" }}
        />
      ) : null}
      <View pointerEvents="none" className="absolute left-0 right-0 top-0 h-px" style={{ backgroundColor: tokens.isLight ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.42)" }} />
      {children}
    </View>
  );
}

export function GlassInput({ style, ...props }: any): React.JSX.Element {
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
        <BlurView
          pointerEvents="none"
          intensity={28}
          tint={tokens.isLight ? "light" : "dark"}
          className="absolute inset-0"
          style={{ backgroundColor: "transparent" }}
        />
      ) : null}
      <View
        style={[
          {
            color: tokens.text,
            fontSize: 16,
            padding: 16,
            backgroundColor: "transparent",
          },
          style,
        ]}
        placeholderTextColor={tokens.mutedText}
        {...props}
      />
    </View>
  );
}
