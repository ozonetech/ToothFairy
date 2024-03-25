import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Background() {
  return (
    <View style={{ backgroundColor: "black" }}>
      <Image
        style={styles.backgroundImage}
        source={require("../assets/images/background.png")}
      ></Image>
    </View>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
  },
});
