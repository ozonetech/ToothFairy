import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, memo } from "react";
import { router, useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";

const NewsField = ({ item }) => {
  return (
    <View>
      <View style={styles.fullBox}>
        <Image
          resizeMode="cover"
          style={{
            width: wp("90%"),
            height: hp("30%"),
            alignSelf: "center",
            marginBottom: 10,
            borderRadius: 10,
          }}
          source={{ uri: item.ImageUri }}
        ></Image>
        <View style={styles.newContent}>
          <Text>{item.Headline}</Text>
          <View>
            <Text>{item.Detains}</Text>
          </View>
        </View>
      </View>
      {/* <View style={{ marginTop: "auto" }}>
        <Button title="Move" onPress={() => router.push("coinScreen")}></Button>
        <Button title="Reset" onPress={resetAsyncStorage}></Button>
      </View> */}
    </View>
  );
};

export default memo(NewsField);

const styles = StyleSheet.create({
  fullBox: {
    width: wp("90%"),
    // height: hp("40%"),
    // backgroundColor: "#D7EDDB",
    borderBottomWidth: 1,
    borderBottomColor: "#dbdad7",

    // padding: 20,
    overflow: "hidden",
    marginVertical: 2,
  },
  newContent: { marginLeft: 10, marginVertical: 10 },
});
