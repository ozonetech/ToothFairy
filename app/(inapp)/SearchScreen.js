import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { fetchSearchNews } from "../../utils/NewsApi";
import { debounce } from "lodash";
import NewsSection from "../../components/NewsSection/NewsSection";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";

export default function SearchScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
          width: "100%",
          padding: 2,
          backgroundColor: "#ebe9e4",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 0,
          padding: 10,
        }}
      >
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search for your news"
          placeholderTextColor={"gray"}
          style={{ fontSize: hp(5.2) }}
        />
        <TouchableOpacity onPress={() => router.navigate("News")}>
          <XMarkIcon size="25" color="#575655" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View className="mx-4 mb-4 ">
        <Text
          className="text-xl dark:text-white"
          style={{
            fontSize: hp(2),
            fontWeight: "bold",
            color: "#fff",
            padding: 5,
            backgroundColor: "green",
          }}
        >
          {results?.length} News for {searchTerm}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: hp(5),
        }}
      >
        <NewsSection newsProps={results} label="Search Results" />
      </ScrollView>
    </View>
  );
}
