import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SpinAndWin from "../(ingame)/src/components/SpinAndWin";

export default function App() {
  return (
    <SafeAreaProvider>
      <SpinAndWin />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
