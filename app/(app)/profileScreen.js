import {
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useState, useEffect } from "react";
import {
  Ionicons,
  Zocial,
  Fontisto,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Background from "../../components/Background";
import { AuthContextProvider, useAuth } from "../../context/authContext";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import colors from "../../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
//   RewardedInterstitialAd,
//   RewardedAdEventType,
//   InterstitialAd,
//   AdEventType,
// } from "react-native-google-mobile-ads";

// const adUnitId = __DEV__
//   ? "ca-app-pub-8184917210189339/4786520640"
//   : TestIds.INTERSTITIAL;

// const insterstitial = InterstitialAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
// });

// const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
//   TestIds.REWARDED_INTERSTITIAL,
//   {
//     requestNonPersonalizedAdsOnly: true,
//   }
// );

const profileScreen = () => {
  const { logout, user } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const handleLogout = async () => {
    await logout();
  };
  // const adUnitId = __DEV__
  //   ? TestIds.ADAPTIVE_BANNER
  //   : "ca-app-pub-8184917210189339/4699423560";

  // intertial

  // const [InterstitialLoaded, setIntertialLoaded] = useState(false);
  // const [rewardInterstitialLoaded, setrewardIntertialLoaded] = useState(false);

  // const loadInterstial = () => {
  //   const unsubscribeLoaded = insterstitial.addAdEventListener(
  //     AdEventType.LOADED,
  //     () => {
  //       setIntertialLoaded(true);
  //     }
  //   );

  //   const unsubscribeClosed = insterstitial.addAdEventListener(
  //     AdEventType.CLOSED,
  //     () => {
  //       setIntertialLoaded(false);
  //       insterstitial.load();
  //     }
  //   );
  //   insterstitial.load();
  //   return () => {
  //     unsubscribeClosed();
  //     unsubscribeLoaded();
  //   };
  // };
  // useEffect(() => {
  //   const unsubscribeInterstialEvents = loadInterstial();
  //   const unsubscribeRewardedInterstialEvents = loadRewardInterstitial();
  //   return () => {
  //     unsubscribeInterstialEvents();
  //     unsubscribeRewardedInterstialEvents();
  //   };
  // }, []);

  // Rewarded Ads

  // const loadRewardInterstitial = () => {
  //   try {
  //     const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
  //       RewardedAdEventType.LOADED,
  //       () => {
  //         setrewardIntertialLoaded(true);
  //       }
  //     );

  //     const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
  //       RewardedAdEventType.EARNED_REWARD,
  //       (reward) => {
  //         console.log(`User earned reward of ${reward.amount} ${reward.type}`);
  //         setrewardIntertialLoaded(true);
  //       }
  //     );

  //     const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
  //       AdEventType.CLOSED,
  //       () => {
  //         setrewardIntertialLoaded(false);
  //         rewardedInterstitial.load();
  //       }
  //     );

  //     rewardedInterstitial.load();

  //     return () => {
  //       unsubscribeClosed();
  //       unsubscribeEarned();
  //       unsubscribeLoaded();
  //     };
  //   } catch (error) {
  //     console.error("Error loading rewarded interstitial:", error);
  //   }
  // };

  return (
    <View style={styles.profileContainer}>
      <Background></Background>
      <View>
        <TouchableOpacity
          style={{
            position: "absolute",
            left: wp(8),
            marginTop: 20,
            zIndex: 100,
          }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={30} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ elevation: 10, zIndex: 1, width: "100%" }}
          onPress={() => router.navigate("editProfileScreen")}
        >
          <Image
            style={styles.profileImage}
            source={{
              uri: user?.profileImage,
            }}
          />
        </TouchableOpacity>
        <View style={styles.detailsContainer}>
          <View style={styles.profileauthDetains}>
            <Text style={styles.headerText}>{user?.name}</Text>
            <Text style={styles.detailsText}>@{user?.username}</Text>
          </View>
          <View style={styles.formDetails}>
            <View style={styles.formDetailsInner}>
              <View style={{}}>
                <Text style={styles.icon}>
                  <Zocial name="email" size={24} />
                </Text>
              </View>
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                }}
              >
                <Text style={styles.detailsText}>{user?.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.formDetailsInner}
              onPress={() => router.navigate("CoinPageDetails")}
            >
              <Text style={styles.icon}>
                <FontAwesome6 name="coins" size={24} />
              </Text>
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                }}
              >
                <Text style={[styles.detailsText]}>My Coins</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.formDetailsInner}
              onPress={() => router.navigate("coinScreen")}
            >
              <Text style={styles.icon}>
                <MaterialCommunityIcons name="chart-areaspline" size={24} />
              </Text>
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                }}
              >
                <Text style={styles.detailsText}>Crypto Market</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.formDetailsInner}
              onPress={() => router.navigate("editProfileScreen")}
            >
              <Text style={styles.icon}>
                <AntDesign name="edit" size={24} color="white" />
              </Text>
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                }}
              >
                <Text style={styles.detailsText}>Edit Profile</Text>
              </View>
            </TouchableOpacity>
            {/* {rewardInterstitialLoaded ? (
              <Button
                title="Show Rewarded Interstitial Ad"
                onPress={() => {
                  try {
                    rewardedInterstitial.show();
                  } catch (error) {
                    console.error(
                      "Error showing rewarded interstitial:",
                      error
                    );
                  }
                }}
              />
            ) : (
              <Text>Loading Rewarded Interstitial...</Text>
            )}
            {InterstitialLoaded ? (
              <Button
                title="Show Interstitial Ad"
                onPress={() => {
                  insterstitial.show();
                }}
              />
            ) : (
              <Text> LoadingIntertial ...</Text>
            )} */}
          </View>
        </View>
        <TouchableOpacity style={styles.logout} onPress={() => handleLogout()}>
          <Text style={{ color: colors.white, fontSize: 20 }}>Logout</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{ bottom: 40 }}>
        <BannerAd
          unitId={
            Platform.OS === "ios"
              ? "ca-app-pub-8184917210189339/3372763981"
              : "ca-app-pub-8184917210189339/3372763981"
          }
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />

        <BannerAd
          unitId={"ca-app-pub-8184917210189339/4699423560"}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View> */}
    </View>
  );
};

export default profileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "gray",
    top: hp(10),
    zIndex: 1,

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
    fontSize: hp(3),
    color: "#fff",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  formDetails: {},
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
