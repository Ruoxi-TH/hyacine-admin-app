/// <reference types="expo/types" />

declare module "expo-router" {
  export const router: {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    dismiss: () => void;
  };
  export const Stack: any;
  export const Tabs: any;
}