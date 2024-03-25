import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Wheel from "./Wheel";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SCREEN_WIDTH } from "../constants/screen";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Header from "./Header";
import WalletView from "./WalletView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/authContext";
import LottieView from "lottie-react-native";

// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
//   RewardedInterstitialAd,
//   RewardedAdEventType,
//   InterstitialAd,
//   AdEventType,
// } from "react-native-google-mobile-ads";

const segments = [100000, 1, 4, 50, 30, 20, 600, 2000, 30, 0];
const initilaBalance = "1.7";

// const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
//   TestIds.REWARDED_INTERSTITIAL,
//   {
//     requestNonPersonalizedAdsOnly: true,
//   }
// );

const SpinAndWin = () => {
  const insets = useSafeAreaInsets();
  const labelOpacity = useSharedValue(0);
  const [walletBalance, setWalletBalance] = useState(initilaBalance);
  const amount = useSharedValue(Number(initilaBalance));
  const [totalBalance, setTotalBalance] = useState(0);
  const { updateCoin, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [display, setDisplay] = useState<"none" | "flex" | undefined>("flex");
  const [rewardInterstitialLoaded, setrewardIntertialLoaded] = useState(false);

  // Rewarded Ads

  // const loadRewardInterstitial = () => {
  //   try {
  //     const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
  //       RewardedAdEventType.LOADED,
  //       () => {
  //         setIsLoading(false);
  //       }
  //     );

  //     const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
  //       RewardedAdEventType.EARNED_REWARD,
  //       (reward) => {
  //         console.log(`User earned reward of ${reward.amount} ${reward.type}`);
  //         setIsLoading(true);
  //       }
  //     );

  //     const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
  //       AdEventType.CLOSED,
  //       () => {
  //         setIsLoading(false);
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

  useEffect(() => {
    // Update display based on isLoading state
    setDisplay(isLoading ? "flex" : "none");
  }, [isLoading]);

  // useEffect(() => {
  //   return loadRewardInterstitial();
  // }, []);

  const handleWheelEnd = (value: number) => {
    const updatedBalance = value * Number(initilaBalance);
    const coin = totalBalance + updatedBalance;

    setIsLoading(true);

    updateCoin(coin).then(() => {
      // rewardedInterstitial.show();
      setIsLoading(false);
    });

    setWalletBalance(initilaBalance + " x " + value.toString());
    setTotalBalance(coin);
    labelOpacity.value = withTiming(1, { duration: 800 });
    amount.value = withTiming(updatedBalance, { duration: 800 });
  };
  const handleOnSpin = () => {
    amount.value = 1.7; //set back to initial value
    labelOpacity.value = 0;
  };

  const amountText = useDerivedValue(() => {
    return `${amount.value.toFixed(1)}`;
  }, []);

  return (
    <LinearGradient
      style={[styles.container, { paddingTop: insets.top }]}
      colors={["#FF0000", "#A00000"]}
    >
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          marginTop: 120,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          alignItems: "center",
          justifyContent: "center",
          display: display,
        }}
      >
        <LottieView
          style={{ height: 200, width: 200 }}
          source={require("../../../../assets/lottie/coinLoading.json")}
          autoPlay
          loop
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Please Wait ...
        </Text>
        <Text style={{ color: "#fff" }}>
          Adding your Earnings to your wallet
        </Text>
      </View>
      <Header />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 15, marginHorizontal: 10, color: "#fff" }}>
          Coins
        </Text>
        <Text
          style={{ fontSize: 25, fontWeight: "bold", color: Colors.primary }}
        >
          {user?.coin}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          alignItems: "center",
          borderRadius: 15,
          flexDirection: "row",
          marginVertical: 10,
          elevation: 20,
        }}
      >
        <Text
          style={{
            marginHorizontal: 10,
            fontWeight: "bold",
            color: Colors.primary,
          }}
        >
          Amount Earned:
        </Text>
        <Text
          style={{
            color: "red",
            zIndex: 10,
            fontSize: 20,
            padding: 10,
            fontWeight: "bold",
          }}
        >
          {totalBalance}
        </Text>
      </View>
      <Text style={styles.multiplyEarningsText}>Multiply your Earnings</Text>
      <WalletView
        opacity={labelOpacity}
        amountText={amountText}
        walletBalance={walletBalance}
      />
      <Wheel segments={segments} onEnd={handleWheelEnd} onSpin={handleOnSpin} />
    </LinearGradient>
  );
};

export default SpinAndWin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SCREEN_WIDTH / 1.4,
    alignSelf: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#454D77",
    borderRadius: 14,
    paddingBottom: 10,
  },
  topBarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: "#424677",
    width: SCREEN_WIDTH * 0.9,
    height: 1,
  },
  multiplyEarningsText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    marginBottom: 20,
  },
  walletView: {
    position: "relative",
    marginTop: 30,
  },
  walletLabel: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 4,
    alignItems: "center",
    position: "absolute",
    top: -15,
    zIndex: 2,
    width: 100,
    left: (SCREEN_WIDTH / 2 - 100) / 2,
    borderRadius: 50,
    paddingHorizontal: 12,
    height: 35,
  },
  walletLabelText: {
    fontSize: 18,
    fontWeight: "500",
  },
  walletContent: {
    width: SCREEN_WIDTH / 2,
    height: 110,
    borderColor: "rgba(209, 177, 177,0.4)",
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  walletTextContainer: {
    rowGap: 8,
  },
  addedToWalletText: {
    color: "white",
  },
  walletAmountContainer: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },
  walletAmountText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
