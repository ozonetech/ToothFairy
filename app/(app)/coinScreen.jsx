import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import CoinItem from "../../components/coins/CoinItem";
import { getMarketData, getMarketDataNaira } from "../src/services/requests";
import { FlashList } from "@shopify/flash-list";

const HomeScreen = () => {
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
    const coinsData = await getMarketDataNaira();
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
    </View>
  );
};

export default HomeScreen;
