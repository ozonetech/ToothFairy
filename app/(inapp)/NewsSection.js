import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState, memo } from "react";
import { fetchBreakingNews, fetchRecommendedNews } from "../../utils/NewsApi";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  Button,
} from "react-native";
import { BookmarkSquareIcon } from "react-native-heroicons/solid";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
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
// const tadUnitId = __DEV__
//   ? TestIds.ADAPTIVE_BANNER
//   : "ca-app-pub-7891313948616469/9710919546";

const NewsSection = ({ newsProps }) => {
  const navigation = useNavigation();
  const [urlList, setUrlList] = useState([]);
  const [bookmarkStatus, setBookmarkStatus] = useState([]);
  const [loading, setLoading] = useState();

  // Function to format the date
  function formatDate(isoDate) {
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, options);
  }

  // Hook to set the URL list
  useEffect(() => {
    const urls = newsProps.map((item) => item.url);
    setUrlList(urls);
  }, [newsProps]);

  // Function to handle click on an item
  const handleClick = (item) => {
    navigation.navigate("NewsDetails", item);
  };

  // Function to toggle bookmark and save article
  const toggleBookmarkAndSave = async (item, index) => {
    try {
      const savedArticles = await AsyncStorage.getItem("savedArticles");
      let savedArticlesArray = savedArticles ? JSON.parse(savedArticles) : [];

      // Check if the article is already in the bookmarked list
      const isArticleBookmarked = savedArticlesArray.some(
        (savedArticle) => savedArticle.url === item.url
      );

      if (!isArticleBookmarked) {
        // If the article is not bookmarked, add it to the bookmarked list
        savedArticlesArray.push(item);
        await AsyncStorage.setItem(
          "savedArticles",
          JSON.stringify(savedArticlesArray)
        );
        const updatedStatus = [...bookmarkStatus];
        updatedStatus[index] = true;
        setBookmarkStatus(updatedStatus);
      } else {
        // If the article is already bookmarked, remove it from the list
        const updatedSavedArticlesArray = savedArticlesArray.filter(
          (savedArticle) => savedArticle.url !== item.url
        );
        await AsyncStorage.setItem(
          "savedArticles",
          JSON.stringify(updatedSavedArticlesArray)
        );
        const updatedStatus = [...bookmarkStatus];
        updatedStatus[index] = false;
        setBookmarkStatus(updatedStatus);
      }
    } catch (error) {
      console.log("Error Saving/Removing Article", error);
    }
  };

  // Effect to load saved articles from AsyncStorage when the component mounts
  useFocusEffect(
    useCallback(() => {
      const loadSavedArticles = async () => {
        try {
          const savedArticles = await AsyncStorage.getItem("savedArticles");
          const savedArticlesArray = savedArticles
            ? JSON.parse(savedArticles)
            : [];

          // Check if each URL in 'urlList' exists in the bookmarked list
          const isArticleBookmarkedList = urlList.map((url) =>
            savedArticlesArray.some((savedArticle) => savedArticle.url === url)
          );

          // Set the bookmark status for all items based on the loaded datac
          setBookmarkStatus(isArticleBookmarkedList);
        } catch (error) {
          console.log("Error Loading Saved Articles", error);
        }
      };

      loadSavedArticles();
    }, [navigation, urlList]) // Include 'navigation' in the dependencies array if needed
  );

  // Component to render each item in the list
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={index} onPress={() => handleClick(item)}>
        <View
          style={styles.container}
          className="flex-row justify-start w-[100%]shadow-sm"
        >
          {/* Image */}
          <View
            style={styles.newsImageContainer}
            className="items-start justify-start w-[20%]"
          >
            {item.urlToImage && (
              <Image
                source={{
                  uri: item.urlToImage,
                }}
                style={[
                  styles.newsImage,
                  {
                    width: wp("90%"),
                    height: hp("30%"),
                    alignSelf: "center",
                    marginBottom: 10,
                    borderRadius: 10,
                  },
                ]}
                resizeMode="cover"
                className="rounded-lg"
              />
            )}
          </View>

          {/* Content */}

          <View style={styles.newContent}>
            {/* Author */}
            <Text style={{ fontWeight: "bold", fontSize: hp(2) }}>
              {item?.author?.length > 20
                ? item.author.slice(0, 20) + "..."
                : item.author}
            </Text>

            {/* Title */}
            <Text
              style={{
                fontSize: hp(3),
              }}
            >
              {item.title.length > 50
                ? item.title.slice(0, 100) + "..."
                : item.title}
            </Text>

            {/* Date */}
            <Text className="text-xs text-gray-700 dark:text-neutral-300">
              {formatDate(item.publishedAt)}
            </Text>
          </View>

          {/* Bookmark */}
          <View style={styles.bookmark}>
            <TouchableOpacity
              onPress={() => toggleBookmarkAndSave(item, index)}
            >
              <BookmarkSquareIcon
                color={bookmarkStatus[index] ? "green" : "gray"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const refetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const newsData = await fetchRecommendedNews();
      newsProps = newsData;
    } catch (error) {
      // Handle Axios error (e.g., when reaching request limit)
      console.error("Axios Error:", error);
      if (error.response && error.response.status === 429) {
        // Display user-friendly error message
        Alert.alert(
          "Too Many Requests",
          "Sorry, we've reached the request limit. Please try again later."
        );
      } else {
        // Handle other errors
        Alert.alert(
          "Error",
          "Failed to fetch news data. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ height: "100%", width: "100%" }}>
      {/* Header */}

      <FlatList
        style={{ marginBottom: 60 }}
        estimatedItemSize={300}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        data={newsProps}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onEndReached={() => refetchCoins(newsProps.length / 66 + 1)}
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
export default memo(NewsSection);

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    flex: 1,
    marginTop: 20,
  },
  newContent: { marginLeft: 10, marginVertical: 10 },
  bookmark: { bottom: hp(15), marginLeft: "auto" },
});
