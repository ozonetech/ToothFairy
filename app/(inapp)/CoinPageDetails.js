import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import Background from "./../../components/Background";
import { AuthContextProvider, useAuth } from "./../../context/authContext";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import colors from "./../../constants/Colors";

const CoinPageDetails = () => {
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <View style={styles.profileContainer}>
      <Background></Background>
      <View>
        <TouchableOpacity
          style={{
            // position: "absolute",
            left: wp(8),
            backgroundColor: "#fff",
            elevation: 10,
            alignItems: "center",
            padding: 10,
            width: wp("20%"),
            borderRadius: 10,
            marginBottom: -20,
          }}
          onPress={() => router.navigate("profileScreen")}
          activeOpacity={0.9}
        >
          <Ionicons name="chevron-back" size={30} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ elevation: 10, zIndex: 10 }}>
          <Image
            style={styles.profileImage}
            source={{
              uri: user?.profileImage,
            }}
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.profileauthDetains}>
            <Text style={styles.headerText}>{user?.name}</Text>
            <Text style={styles.detailsText}>@{user?.username}</Text>
          </View>
          <View style={styles.formDetails}>
            <View style={styles.formDetailsInner}>
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                }}
              >
                <Text style={[styles.detailsText, { fontSize: 30 }]}>
                  AMOUNT OF TOOTHFAIRY COINS {"\n"} EARNED
                </Text>
              </View>
            </View>

            <View style={styles.formDetailsInner}>
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                  backgroundColor: "#C27B05",
                  borderRadius: 10,
                }}
              >
                <Text
                  style={[styles.detailsText, { fontSize: 35, padding: 10 }]}
                >
                  {user?.coin} COINS
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.navigate("exchange")}>
              <Text>Exchange your coin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CoinPageDetails;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    top: hp("10%"),
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "gray",
    top: hp(10),
    zIndex: 10,

    marginLeft: 20,
  },
  detailsContainer: {
    backgroundColor: "#E2B801",
    width: wp("80%"),
    height: hp("60%"),
    alignSelf: "center",
    borderRadius: 10,
    borderTopLeftRadius: 50,
    paddingHorizontal: wp(5),
  },
  profileauthDetains: {
    marginLeft: "auto",
  },
  headerText: {
    fontSize: hp(5),
    fontWeight: "bold",
    color: "#fff",
  },
  detailsText: {
    color: "#fff",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  formDetails: {
    marginTop: 50,
  },
  formDetailsInner: {
    flexDirection: "row",
    marginVertical: 20,
    alignItems: "center",
  },
  icon: {
    color: "#fff",
  },
  logout: {
    marginVertical: 40,
    marginLeft: wp("62%"),
    backgroundColor: colors.primary,
    width: 100,
    alignItems: "center",
    padding: 13,
    borderRadius: 10,
    elevation: 10,
    shadowRadius: 2,
  },
});
