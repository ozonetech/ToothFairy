import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import CoinItem from "../../components/coins/CoinItem";
import { getMarketData, getMarketDataNaira } from "../src/services/requests";
import { FlashList } from "@shopify/flash-list";

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

const HomeScreen = () => {
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
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ncoins, setnCoins] = useState([]);

  const fetchCoins = async (pageNumber) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData(pageNumber);
    setCoins((existingCoins) => [...existingCoins, ...coinsData]);
    // const ncoinsData = await getMarketDataNaira(pageNumber);
    // setnCoins((existingCoins) => [...existingCoins, ...ncoinsData]);
    setLoading(false);
  };

  const refetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData();
    // const ncoinsData = await getMarketDataNaira();
    setCoins(coinsData);
    // setnCoins(ncoinsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={coins}
        renderItem={({ item }) => <CoinItem marketCoin={item} />}
        onEndReached={() => fetchCoins(coins.length / 50 + 1)}
        estimatedItemSize={200}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor="white"
            onRefresh={refetchCoins}
          />
        }
      />
      <View style={{}}>
        <BannerAd
          unitId={tadUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
