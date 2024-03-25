import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";

export default function _Layout() {
  return (
    <Stack>
      <Stack.Screen name="NewsDetails"></Stack.Screen>
    </Stack>
  );
}
