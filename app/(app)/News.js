import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Header from "../../components/Header/Header";
import NewsSection from "../(inapp)/NewsSection";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fetchBreakingNews, fetchRecommendedNews } from "../../utils/NewsApi";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  RewardedInterstitialAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";

// banner ads
const tadUnitId = "ca-app-pub-7891313948616469/9710919546";

//intertial ads

const adUnitId = "ca-app-pub-7891313948616469/2419904269";

const insterstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function News() {
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
  const { data: recommendedNew, isLoading: isRecommendedLoading } = useQuery({
    queryKey: ["recommededNews"],
    queryFn: fetchRecommendedNews,
  });

  return (
    <View className=" flex-1 bg-white dark:bg-neutral-900">
      {/* <StatusBar style={colorScheme == "dark" ? "light" : "dark"} /> */}
      <View>
        {/* Header */}

        {/* {interstitialLoaded ? (
          <Button
            title="Show Interstitial Ad"
            onPress={() => {
              insterstitial.show();
            }}
          />
        ) : (
          <Text> LoadingIntertial ...</Text>
        )} */}

        <Header />

        {/* Breaking News */}
        {/* {isBreakingLoading ? (
          <Loading />
        ) : (
          <View className="">
            <MiniHeader label="Breaking News" />
            <BreakingNews label="Breaking News" data={data.articles} />
          </View>
        )} */}

        {/* Recommended News */}
        <View>
          {/* <MiniHeader label="Recommended" /> */}
          <View style={{ top: 50 }}>
            {isRecommendedLoading ? (
              <ActivityIndicator />
            ) : recommendedNew && recommendedNew.articles ? ( // Check if recommendedNew and articles exist
              <NewsSection
                label="Recommendation"
                newsProps={recommendedNew.articles}
              />
            ) : (
              <Text
                style={{
                  fontWeight: "bold",
                  alignSelf: "center",
                  fontWeight: 100,
                  top: 100,
                }}
              >
                No news available, Please Try Again Later
              </Text>
            )}
          </View>

          <View style={{ position: "absolute" }}>
            <BannerAd
              unitId={tadUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
