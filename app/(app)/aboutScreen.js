import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { memo } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { FontAwesome, Foundation } from "@expo/vector-icons";

const aboutScreen = () => {
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

  //   const WhatsAppLink = ({ phoneNumber, text }) => {
  //     const handlePress = () => {
  //       const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
  //       Linking.openURL(whatsappUrl).catch(() => {
  //         alert("Make sure WhatsApp is installed on your device.");
  //       });
  //     };

  //     return (
  //       <TouchableOpacity onPress={handlePress}>
  //         <Text style={styles.link}>{text}</Text>
  //       </TouchableOpacity>
  //     );
  //   };

  return (
    <ScrollView style={{ height: hp("90%") }}>
      <View style={styles.aboutContainer}>
        <View style={styles.box}>
          <Text style={styles.header}>Founder</Text>
          <Text style={styles.paragraph}>
            The toothfairy coin token is powered by Fejugga Tech. whose founder
            and CEO is Olufemi Ajibaiye a innovator at heart.
          </Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.header}>Safe investment</Text>
          <Text style={styles.paragraph}>
            Liquidity is locked for good immediately after launch. Tokens were
            sent to burnt address which means the liquidity could never be
            pulled out to ensure investors peace of mind.
          </Text>
        </View>
        <View
          style={[
            styles.social1,
            { backgroundColor: "#CD564D", marginTop: 30 },
          ]}
        >
          <View style={[styles.icon, { backgroundColor: "#CD564D" }]}>
            <FontAwesome
              name="envelope"
              size={24}
              color="#CD564D"
              style={{ backgroundColor: "#fff", padding: 5, borderRadius: 20 }}
            />
          </View>
          <SocialLink
            url="mailto:fejuggayoungstars@gmail.com"
            text="fejuggayoungstars@gmail.com"
          />
        </View>
        <View style={[styles.social1, { backgroundColor: "#E2B801" }]}>
          <View style={[styles.icon, { backgroundColor: "#E2B801" }]}>
            <FontAwesome
              name="whatsapp"
              size={24}
              color="#E2B801"
              style={{ backgroundColor: "#fff", padding: 5, borderRadius: 20 }}
            />
          </View>
          <SocialLink
            url="whatsapp://send?phone=+2347026178387"
            text="Message me on WhatApp"
          ></SocialLink>
        </View>
        <View style={[styles.social1, { backgroundColor: "#6C3805" }]}>
          <View style={[styles.icon, { backgroundColor: "#6C3805" }]}>
            <Foundation
              name="web"
              size={24}
              color="#6C3805"
              style={{
                backgroundColor: "#fff",
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
              }}
            />
          </View>
          <SocialLink
            url="http://dtoothfairy.com"
            text="http://dtoothfairy.com"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(aboutScreen);

const styles = StyleSheet.create({
  aboutContainer: {
    width: wp("85%"),
    height: hp("100%"),
    alignSelf: "center",
    marginBottom: 30,
  },
  box: {
    backgroundColor: "rgba(226 184 1 / 0.5)",
    alignItems: "center",
    marginVertical: 10,
    top: 10,
  },
  header: {
    fontSize: 25,
    fontWeight: "500",
    padding: 20,
  },
  paragraph: {
    fontSize: 20,
    padding: 15,
    textAlign: "center",
    paddingBottom: 30,
  },
  social1: {
    flexDirection: "row",
    backgroundColor: "red",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  icon: {
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
