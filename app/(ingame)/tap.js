import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { useAuth } from "@/context/authContext";

import {
  BannerAd,
  BannerAdSize,
  TestIds,
  RewardedInterstitialAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

const radUnitId = "ca-app-pub-7891313948616469/7356218948";

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  radUnitId,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

const TapGame = () => {
  const [earnings, setEarnings] = useState(0.0);
  const [animation] = useState(new Animated.Value(1));
  const [isLoading, setIsLoading] = useState(false);
  const { updateCoin, user } = useAuth();
  const [display, setDisplay] = useState("none");
  const [rewardInterstitialLoaded, setrewardIntertialLoaded] = useState(false);

  // Rewarded Ads

  const loadRewardInterstitial = () => {
    try {
      const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          setrewardIntertialLoaded(true);
        }
      );

      const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log(`User earned reward of ${reward.amount} ${reward.type}`);
          setrewardIntertialLoaded(true);
        }
      );

      const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          setrewardIntertialLoaded(false);
          rewardedInterstitial.load();
        }
      );

      rewardedInterstitial.load();

      return () => {
        unsubscribeClosed();
        unsubscribeEarned();
        unsubscribeLoaded();
      };
    } catch (error) {
      console.error("Error loading rewarded interstitial:", error);
    }
  };

  useEffect(() => {
    // Update display based on isLoading state
    setDisplay(isLoading ? "flex" : "none");
  }, [isLoading]);

  useEffect(() => {
    return loadRewardInterstitial();
  }, []);

  // banner ads
  const tadUnitId = "ca-app-pub-7891313948616469/9710919546";

  const handleTap = () => {
    setEarnings((prevEarnings) => prevEarnings + 0.1);
    startAnimation();
  };

  const handleDone = () => {
    setIsLoading(true);
    try {
      rewardedInterstitial.show();
      updateCoin(earnings).then(() => {
        setIsLoading(false);
      });
      setEarnings(0);
    } catch (error) {
      Alert.alert("Please Check Your Internet", "Coin Was not Updated");
    }
  };

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.2,
        duration: 80,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.earningsText}>Earnings: {earnings.toFixed(2)}</Text>
      <TouchableOpacity onPress={handleTap}>
        <Animated.Image
          source={require("../../assets/images/coin.png")}
          style={[styles.coinImage, { transform: [{ scale: animation }] }]}
        />
      </TouchableOpacity>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0)",
          zIndex: 1000,
          alignItems: "center",
          justifyContent: "center",
          display: display,
        }}
      >
        <LottieView
          style={{ height: 200, width: 200 }}
          source={require("../../assets/lottie/coinLoading.json")}
          autoPlay
          loop
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "black",
          }}
        >
          Please Wait ...
        </Text>
        <Text style={{ color: "#000" }}>
          Adding your Earnings to your wallet
        </Text>
        <Text style={{ color: "red", marginVertical: 10, fontWeight: "bold" }}>
          Wait Or{" "}
        </Text>
        <TouchableOpacity
          style={{
            width: "80%",
            backgroundColor: "red",
            height: 30,
            elevation: 10,
            marginVertical: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.navigate("game")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
      {rewardInterstitialLoaded ? (
        <Button title="Add Coin" onPress={handleDone} />
      ) : (
        <View>
          <Text style={{ color: "red" }}>
            Please Wait for the Add Coin Button...
          </Text>
          <Text style={{ color: "red" }}>
            You Can't Add Earnings to Coin Until the Add Button is ready
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={{
          width: "80%",
          backgroundColor: "red",
          height: 30,
          elevation: 10,
          top: 150,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => router.navigate("game")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
      </TouchableOpacity>

      <View style={{ bottom: "-20%" }}>
        <BannerAd
          unitId={tadUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coinImage: {
    width: 300,
    height: 300,
  },
  earningsText: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default TapGame;
