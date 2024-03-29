import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
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
import { FontAwesome, Foundation } from "@expo/vector-icons";

const CoinPageDetails = () => {
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  console.log(user);
  const message = `My Username is  ${user.username}, My user ID is ${user.uid}, and My Email is ${user.email}. I want to Exchange my Coin`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `whatsapp://send?phone=+2347026178387&text=${encodedMessage}`;

  const SocialLink = ({ url, text }) => {
    const handlePress = () => {
      Linking.openURL(url);
    };

    return (
      <TouchableOpacity style={styles.socialLink} onPress={handlePress}>
        <Text style={styles.link}>{text}</Text>
      </TouchableOpacity>
    );
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
            <View style={[styles.social1, { backgroundColor: "#C27B05" }]}>
              <SocialLink
                url={whatsappUrl}
                text="Exchange Your Coin"
              ></SocialLink>
            </View>
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
  social1: {
    flexDirection: "row",
    backgroundColor: "red",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  icon2: {
    backgroundColor: "red",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: -10,
  },
  socialLink: {
    color: "#fff",
    alignItems: "center",
    width: "100%",
  },
  link: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
