import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { ChevronLeftIcon, ShareIcon } from "react-native-heroicons/outline";
import { BookmarkSquareIcon } from "react-native-heroicons/solid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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
const tadUnitId = __DEV__
  ? "ca-app-pub-7891313948616469/9710919546"
  : TestIds.ADAPTIVE_BANNER;

//intertial ads

const adUnitId = __DEV__
  ? "ca-app-pub-8184917210189339/4786520640"
  : TestIds.INTERSTITIAL;

const insterstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const { height, width } = Dimensions.get("window");

export default function NewsDetails() {
  const { params: item } = useRoute();
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [isBookmarked, toggleBookmark] = useState(false);
  const router = useRouter();

  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [timeLoading, setTimeLoading] = useState(false);

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
        insterstitial.load();
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
  const timerId = setInterval(() => {
    setTimeLoading(true);
  }, 3 * 60 * 1000); // 5 minutes in milliseconds

  useEffect(() => {
    // Show the interstitial ad when it's first loaded
    if (interstitialLoaded && timeLoading) {
      insterstitial.show().then(() => setTimeLoading(false));
    }

    // Clean up the interval when the component unmounts
    return () => clearInterval(timerId);
  }, [interstitialLoaded, timeLoading]); // Update the dependency array

  const toggleBookmarkAndSave = async () => {
    try {
      // Check if News Article is already in Storage
      const savedArticles = await AsyncStorage.getItem("savedArticles");
      let savedArticlesArray = savedArticles ? JSON.parse(savedArticles) : [];
      // console.log("Check if the article is already bookmarked");

      // Check if the article is already in the bookmarked list
      const isArticleBookmarked = savedArticlesArray.some(
        (savedArticle) => savedArticle.url === item.url
      );

      // console.log("Check if the article is already in the bookmarked list");

      if (!isArticleBookmarked) {
        // If the article is not bookmarked, add it to the bookmarked list
        savedArticlesArray.push(item);
        await AsyncStorage.setItem(
          "savedArticles",
          JSON.stringify(savedArticlesArray)
        );
        toggleBookmark(true);
        // console.log("Article is bookmarked");
      } else {
        // If the article is already bookmarked, remove it from the list
        const updatedSavedArticlesArray = savedArticlesArray.filter(
          (savedArticle) => savedArticle.url !== item.url
        );
        await AsyncStorage.setItem(
          "savedArticles",
          JSON.stringify(updatedSavedArticlesArray)
        );
        toggleBookmark(false);
        // console.log("Article is removed from bookmarks");
      }
    } catch (error) {
      console.log("Error Saving Article", error);
    }
  };

  useEffect(() => {
    // Load saved articles from AsyncStorage when the component mounts
    const loadSavedArticles = async () => {
      try {
        const savedArticles = await AsyncStorage.getItem("savedArticles");
        const savedArticlesArray = savedArticles
          ? JSON.parse(savedArticles)
          : [];

        // Check if the article is already in the bookmarked list
        const isArticleBookmarked = savedArticlesArray.some(
          (savedArticle) => savedArticle.url === item.url
        );

        toggleBookmark(isArticleBookmarked);
        // console.log("Check if the current article is in bookmarks");
      } catch (error) {
        console.log("Error Loading Saved Articles", error);
      }
    };

    loadSavedArticles();
  }, [item.url]);

  return (
    <>
      <View
        style={{
          width: "100%",
          paddingVertical: "5%",
        }}
      >
        <View
          className="bg-gray-100 p-2 rounded-full items-center justify-center"
          style={{
            padding: 4,
            alignItems: "center",
            backgroundColor: "black",
            margin: 10,
            borderRadius: 10,
            left: "80%",
            top: 20,
            width: "10%",
          }}
        >
          <TouchableOpacity onPress={() => router.navigate("News")}>
            <ChevronLeftIcon size={25} strokeWidth={3} color="white" />
          </TouchableOpacity>
        </View>

        {/* <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
            <ShareIcon size={25} color="gray" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-100 p-2 rounded-full"
            onPress={toggleBookmarkAndSave}
          >
            <BookmarkSquareIcon
              size={25}
              color={isBookmarked ? "green" : "gray"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View> */}
      </View>

      {/* WebView */}
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <WebView
          source={{ uri: item.url }}
          onLoadStart={() => setVisible(true)}
          onLoadEnd={() => setVisible(false)}
        />
      </View>
      <View style={{}}>
        <BannerAd
          unitId={tadUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>

      {visible && (
        <ActivityIndicator
          size={"large"}
          color={"green"}
          style={{
            position: "absolute",
            top: height / 2,
            left: width / 2,
          }}
        />
      )}
    </>
  );
}
