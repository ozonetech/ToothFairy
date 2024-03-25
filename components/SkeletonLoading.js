import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

export default function SkeletonLoading() {
  return (
    <View
      style={{
        height: "100%",
        width: "80%",
        aspectRatio: 1,
        alignSelf: "center",
        padding: 20,
      }}
    >
      <LottieView
        style={{ flex: 1 }}
        source={require("../assets/lottie/skeleton.json")}
        autoPlay
        loop
      />
    </View>
  );
}
