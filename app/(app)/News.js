import { View, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Header from "../../components/Header/Header";
import NewsSection from "../../components/NewsSection/NewsSection";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fetchBreakingNews, fetchRecommendedNews } from "../../utils/NewsApi";

export default function News() {
  const [loading, setLoading] = useState(false);

  // Breaking News
  const { data, isLoading: isBreakingLoading } = useQuery({
    queryKey: ["breakingNewss"],
    queryFn: fetchBreakingNews,
  });

  // Recommended News
  const { data: recommendedNew, isLoading: isRecommendedLoading } = useQuery({
    queryKey: ["recommededNewss"],
    queryFn: fetchRecommendedNews,
  });

  // const fetchNews = async (pageNumber) => {
  //   if (loading) {
  //     return;
  //   }
  //   setLoading(true);
  //   const coinsData = await getMarketData(pageNumber);
  //   setCoins((existingCoins) => [...existingCoins, ...coinsData]);
  //   // const ncoinsData = await getMarketDataNaira(pageNumber);
  //   // setnCoins((existingCoins) => [...existingCoins, ...ncoinsData]);
  //   setLoading(false);
  // };

  return (
    <View className=" flex-1 bg-white dark:bg-neutral-900">
      {/* <StatusBar style={colorScheme == "dark" ? "light" : "dark"} /> */}
      <View>
        {/* Header */}
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

          <ScrollView
            contentContainerStyle={
              {
                // paddingBottom: hp(80),
              }
            }
          >
            {isRecommendedLoading ? (
              <ActivityIndicator></ActivityIndicator>
            ) : (
              <NewsSection
                label="Recommendation"
                newsProps={recommendedNew.articles}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
