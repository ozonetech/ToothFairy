// Inspiration: https://dribbble.com/shots/14139308-Simple-Scroll-Animation
// Illustrations by: SAMji https://dribbble.com/SAMji_illustrator

import { router } from "expo-router";
import * as React from "react";
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
const { width, height } = Dimensions.get("screen");
import wordleImage from "../../assets/images/wordle.png";
import hittheisland from "../../assets/images/hit.jpg";
import spinandwin from "../../assets/images/Spin.png";
import coin from "../../assets/images/coin.png";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  RewardedInterstitialAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";
import { useState, useEffect } from "react";

//intertial ads

const adUnitId = "ca-app-pub-7891313948616469/2419904269";

const insterstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const data = [
  {
    title: "MATCH THE CARD",
    image: wordleImage,
    how: "A matching card game is a type of puzzle game where players are presented with a grid of facedown cards. The objective of the game is to uncover pairs of matching cards by flipping them over two at a time.",
  },
  {
    title: "SPIN AND WIN",
    image: spinandwin,
    how: "the objective is to spin the wheel spin in hope of hitting high win",
  },
  {
    title: "Hit the Island",
    image: hittheisland,
    how: "As simple as it sounds, Hit The Island with the ball and score points. But wait, there is a catch! The ball speeds up. It can get cloned.y",
  },
  {
    title: "Tap To Earn",
    image: coin,
    how: "JUST TAP",
  },
];

const imageW = width * 0.7;
const imageH = imageW * 1.54;

export default () => {
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  const loadInterstitial = () => {
    const unsubscribeLoaded = insterstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      }
    );

    const unsubscribeClosed = insterstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
      }
    );
    insterstitial.load();
    return () => {
      unsubscribeClosed();
      unsubscribeLoaded();
    };
  };
  useEffect(() => {
    const unsubscribeInterstitialEvents = loadInterstitial();

    return () => {
      unsubscribeInterstitialEvents();
    };
  }, []);

  if (interstitialLoaded) {
    insterstitial.show();
  }

  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* <StatusBar hidden /> */}
      <TouchableOpacity
        style={{ zIndex: 100, left: "80%", marginTop: "10%" }}
        onPress={router.back}
      >
        <AntDesign name="leftcircle" size={34} color="white" />
      </TouchableOpacity>
      <View style={StyleSheet.absoluteFillObject}>
        {data.map((item, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });
          return (
            <Animated.Image
              key={`image-${index}`}
              source={item.image}
              style={[
                StyleSheet.absoluteFillObject,
                {
                  opacity,
                  width: "100%",
                  height: "100%",
                },
              ]}
              blurRadius={20}
            />
          );
        })}
      </View>
      <Animated.FlatList
        data={data}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                width,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  elevation: 20,
                  fontSize: 40,
                  top: -50,
                  fontWeight: "bold",
                }}
              >
                {item.title}
              </Text>
              <TouchableOpacity
                style={{ elevation: 10 }}
                onPress={() => {
                  if (index == 3) {
                    router.navigate("tap");
                  }
                  if (index == 2) {
                    router.navigate("PingPong");
                  }
                  if (index == 1) {
                    router.navigate("Spin");
                  }
                  if (index == 0) {
                    router.navigate("memory");
                  }
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    width: imageW,
                    height: imageH,
                    resizeMode: "cover",
                    borderRadius: 16,
                  }}
                />
              </TouchableOpacity>
              <Text style={{ color: "#fff", fontSize: 20, marginVertical: 10 }}>
                How to Play
              </Text>
              <Text
                style={{
                  color: "#fff",
                  textShadowColor: "rgba(0, 0, 0, 0.55)",
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 5,
                  width: "80%",
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                {item.how}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};
