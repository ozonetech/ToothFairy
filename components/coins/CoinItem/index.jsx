import React, { useState, useEffect, memo } from "react";
import { Text, View, Image, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const CoinItem = ({ marketCoin }) => {
  const {
    id,
    name,
    current_price,
    market_cap_rank,
    price_change_percentage_24h,
    symbol,
    market_cap,
    image,
  } = marketCoin;

  // const [ncoins, setnCoins] = useState([]);

  // const fetchCoins = async (pageNumber) => {
  //   const ncoinsData = await getMarketDataNaira(pageNumber);
  //   setnCoins((existingCoins) => [...existingCoins, ...ncoinsData]);
  // };

  // // const refetchCoins = async () => {
  // //   if (loading) {
  // //     return;
  // //   }
  // //   setLoading(true);
  // //   const coinsData = await getMarketData();
  // //   const ncoinsData = await getMarketDataNaira();
  // //   setCoins(coinsData);
  // //   setnCoins(ncoinsData);
  // //   setLoading(false);
  // // };

  // useEffect(() => {
  //   fetchCoins();
  //   console.log(ncoins.current_price);
  // }, []);

  const navigation = useNavigation();

  const percentageColor =
    price_change_percentage_24h < 0 ? "#ea3943" : "#16c784" || "white";

  const normalizeMarketCap = (marketCap) => {
    if (marketCap > 1e12) {
      return `${(marketCap / 1e12).toFixed(3)} T`;
    }
    if (marketCap > 1e9) {
      return `${(marketCap / 1e9).toFixed(3)} B`;
    }
    if (marketCap > 1e6) {
      return `${(marketCap / 1e6).toFixed(3)} M`;
    }
    if (marketCap > 1e3) {
      return `${(marketCap / 1e3).toFixed(3)} K`;
    }
    return marketCap;
  };

  return (
    <View>
      <Pressable
        style={styles.coinContainer}
        // onPress={() => router.navigate("CoinDetailedScreen", { coinId: id })}
      >
        <Image
          source={{ uri: image }}
          style={{
            height: 30,
            width: 30,
            marginRight: 10,
            alignSelf: "center",
          }}
        />
        <View>
          <Text style={styles.title}>{name}</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.rankContainer}>
              <Text style={styles.rank}>{market_cap_rank}</Text>
            </View>
            <Text style={styles.text}>{symbol.toUpperCase()}</Text>
            <AntDesign
              name={price_change_percentage_24h < 0 ? "caretdown" : "caretup"}
              size={12}
              color={percentageColor}
              style={{ alignSelf: "center", marginRight: 5 }}
            />
            <Text style={{ color: percentageColor }}>
              {price_change_percentage_24h?.toFixed(2)}%
            </Text>
          </View>
        </View>
        <View style={{ marginLeft: "auto", alignItems: "flex-end" }}>
          <Text style={styles.title}>{current_price} USD</Text>
          <Text style={{ color: "green" }}>
            MCap {normalizeMarketCap(market_cap)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default memo(CoinItem);
