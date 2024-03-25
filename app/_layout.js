import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // check if user is authenticated or not
    if (typeof isAuthenticated == "undefined") return;
    const inApp = segments[0] == "(app)";
    if (isAuthenticated && !inApp) {
      // redirect to home
      router.replace("home");
    } else if (isAuthenticated == false) {
      //redirect to signIn
      router.replace("login");
    }
  }, [isAuthenticated]);

  return <Slot></Slot>;
};

// Import your global CSS file
import { AuthContextProvider, useAuth } from "../context/authContext";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout></MainLayout>
    </AuthContextProvider>
  );
}
