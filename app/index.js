import { View, Text, Image, StyleSheet, Button } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LottieView from "lottie-react-native";
import Background from "../components/Background";
import { Stack, useRouter } from "expo-router";
import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";

export default function WelcomeLoading() {
  <Stack.Screen options={{ header: () => null }} />;
  const router = useRouter();
  let [fontsLoaded] = useFonts({
    Inter_900Black,
    DroidSans: require("../assets/fonts/DroidSans.ttf"),
  });

  return (
    <View style={styles.splashScreen}>
      <Background></Background>
      <View style={styles.logoImage}>
        <Image source={require("../assets/images/logo.png")}></Image>
        <Text style={styles.logoText}>Tooth Fairy</Text>
        <LottieView
          style={styles.loading}
          source={require("../assets/lottie/loading.json")}
          autoPlay
          loop
        />
      </View>
      {/* <Image
        style={styles.backgroundImage}
        resizeMode="contain"
        source={require("../assets/images/background.png")}
      ></Image> */}
    </View>
  );
}
const styles = StyleSheet.create({
  logoImage: {
    top: hp("40%"),
    zIndex: 100,
    alignItems: "center",
  },
  logoText: {
    fontSize: 25,
    color: "#774508",
  },
  loading: {
    aspectRatio: 1,
    height: hp("15%"),
  },
  splashScreen: {},
  backgroundImage: {
    position: "absolute",
    height: hp("100%"),
  },
});
