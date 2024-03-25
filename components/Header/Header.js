import { Switch, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Header() {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View>
      {/* <View className="">
        <Text
          className="font-spaceGroteskBold text-2xl text-green-800 dark:text-white font-extrabold uppercase"
          style={{}}
        >
          stack news
        </Text>
      </View> */}

      {/* Switch and Search Icon */}
      <View
        style={{
          height: 50,
          width: "90%",
          borderRadius: 25,
          backgroundColor: "#fff",
          elevation: 10,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          zIndex: 100,
          top: hp("82%"),
          marginLeft: wp("5%"),
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => router.navigate("SearchScreen")}
        >
          <Text style={{ fontSize: 20, marginHorizontal: 10 }}>
            Search For Any News
          </Text>
          <MagnifyingGlassIcon size={25} strokeWidth={2} color={"green"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
