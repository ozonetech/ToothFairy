import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { fetchSearchNews } from "../../utils/NewsApi";
import { debounce } from "lodash";
import NewsSection from "./NewsSection";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
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

//intertial ads

const adUnitId = "ca-app-pub-7891313948616469/7356218948";

const insterstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function SearchScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // banner ads
  const tadUnitId = __DEV__
    ? "ca-app-pub-7891313948616469/9710919546"
    : TestIds.ADAPTIVE_BANNER;

  if (loading) {
    <ActivityIndicator></ActivityIndicator>;
  }

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

  const handleSearch = async (search) => {
    if (search && search?.length > 2) {
      setLoading(true);
      setResults([]);
      setSearchTerm(search);

      try {
        const data = await fetchSearchNews(search);

        setLoading(false);

        if (data && data.articles) {
          setResults(data.articles);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      {/* Search Input */}

      <View
        style={{
          width: "90%",
          padding: 2,
          backgroundColor: "#ebe9e4",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          padding: 10,
          alignItems: "center",
          borderRadius: 20,
          alignSelf: "center",
          top: 20,
        }}
      >
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search for your news"
          placeholderTextColor={"gray"}
          style={{ fontSize: hp(2.5) }}
        />
        <TouchableOpacity onPress={() => router.navigate("News")}>
          <XMarkIcon size="25" color="#575655" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={{ padding: 10, borderRadius: 10, alignItems: "center" }}>
        <View style={{}}>
          <Text
            style={{
              color: "white",
              fontSize: hp(2),
              fontWeight: "bold",
              color: "#fff",
              padding: 5,
              backgroundColor: "green",
              borderRadius: 10,
              marginVertical: 20,
              width: "80%",
              alignSelf: "center",
              paddingHorizontal: 10,
              flexDirection: "row",
            }}
          >
            {loading
              ? "Loading..."
              : results?.length > 0 &&
                `${results.length} Results for ${searchTerm}`}
          </Text>
          {loading && (
            <View style={{ height: 20, width: 20 }}>
              <ActivityIndicator
                size="small"
                color={"white"}
              ></ActivityIndicator>
            </View>
          )}
        </View>
      </View>
      <View style={{ position: "absolute", top: "92%", zIndex: 10 }}>
        <BannerAd
          unitId={tadUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: hp(5),
        }}
      >
        <NewsSection newsProps={results} label="Search Results" />
        <View style={{ position: "absolute", top: 0 }}>
          <BannerAd
            unitId={tadUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
