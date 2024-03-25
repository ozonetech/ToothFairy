import {
  View,
  Text,
  Button,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect, memo } from "react";
import { auth, db, FIREBASE_STORAGE as storage } from "../../FirebaseConfig";
import { router, useRouter } from "expo-router";
import { AuthContextProvider, useAuth } from "../../context/authContext";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import NewsField from "../../components/NewsField";
import { FlatList } from "react-native";
import uploadToFirebase from "../../FirebaseConfig";
import SkeletonLoading from "../../components/SkeletonLoading";
import Colors from "../../constants/Colors";
import { heightPercentageToDP } from "react-native-responsive-screen";
import PhotoPicker from "../../components/PhotoPicker";
import * as ImagePicker from "expo-image-picker";
import { UploadingAndroid } from "../../components/UploadingAndroid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Uploading } from "../../components/Uploading";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
// } from "react-native-google-mobile-ads";

const home = () => {
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully.");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };
  const router = useRouter();
  const { logout, user, refresh, refreshLoading } = useAuth();
  const { isLoggedin, setIsloggedIn } = useState("false");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true); // Assuming you want to set loading to true initially
  const [rloading, setrLoading] = useState(false); // Assuming you want to set loading to true initially
  const [isVisible, setIsVisible] = useState(false);
  const [imageChangeLoading, setImageChangeLoading] = useState(false);

  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [address, setaddress] = useState("");
  const [display, setDisplay] = useState("none");
  const [displayRefreshButton, setDisplayRefreshButton] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const options = ["Open Gallery", "Take Photo", "Take Video"];

  // if choosing new image from camera roll this function opens album
  const takePhoto = async () => {
    if (address == "") {
      Alert.alert(
        "No Receiving Address",
        "Please fill Your Recieving address!"
      );
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // upload the image
      await uploadImage(result.assets[0].uri, "image");
    }
  };

  // if taking image this function opens the camera
  const takeVideo = async () => {
    if (address == "") {
      Alert.alert(
        "No Receiving Address",
        "Please fill Your Recieving address!"
      );
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // upload the image
      await uploadImage(result.assets[0].uri, "image");
    }
  };

  async function pickGallery() {
    if (address == "") {
      Alert.alert(
        "No Receiving Address",
        "Please fill Your Recieving address!"
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri, "video");
    }
  }

  async function uploadImage(uri, fileType) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress.toFixed());
      },
      (error) => {
        // handle error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // save record
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
          setVideo("");
        });
      }
    );
  }

  async function saveRecord(fileType, url, createdAt) {
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;
    const UserEmail = currentUser.email;
    const username = user?.username;
    try {
      const docRef = await addDoc(collection(db, "files"), {
        fileType,
        url,
        createdAt,
        UserEmail,
        userId,
        username,
        address,
      });
      console.log("document saved correctly", docRef.id);
    } catch (e) {
      // console.log(e);
    }
  }

  const RenderInner = () => (
    <View>
      {!imageChangeLoading ? (
        <>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsVisible(false);
                      if (index == 0) {
                        pickGallery();
                      }
                      if (index == 1) {
                        takePhoto();
                      }
                      if (index == 2) {
                        takeVideo();
                      }
                    }}
                    style={{
                      width: "100%",
                      height: 65,
                      marginBottom: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: Colors.light.tint,
                        fontWeight: "600",
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </>
      ) : (
        <ActivityIndicator
          style={{ alignItems: "center", justifyContent: "center" }}
        />
      )}
    </View>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "news"));
        const newsData = [];
        querySnapshot.forEach((doc) => {
          const newsDetails = doc.data();
          newsData.push(newsDetails);
        });
        setNews(newsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news data:", error);
        setLoading(false);
        setDisplayRefreshButton(true);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const refreshData = () => {
    setLoading(true);
    setDisplayRefreshButton(false); // Hide refresh button when attempting to fetch data again
    fetchData().then(setLoading(false));
  };

  const fetchData = async () => {
    if (rloading) {
      return;
    }

    setrLoading(true);

    const querySnapshot = await getDocs(collection(db, "news"));
    const newsData = [];
    querySnapshot.forEach((doc) => {
      const newsDetails = doc.data();
      newsData.push(newsDetails);
    });
    setNews(newsData);
    setrLoading(false);
  };

  return (
    <AuthContextProvider>
      <View style={styles.loginContainer}>
        {/* <Button title="CLear Async" onPress={clearAsyncStorage}></Button> */}

        {loading ? (
          <SkeletonLoading />
        ) : news.length > 0 ? (
          // Display news content here
          // For example:
          news.map((item, index) => (
            <View key={index}>
              <FlatList
                data={news}
                renderItem={({ item }) => <NewsField item={item}></NewsField>}
                keyExtractor={(item) => item.id}
                refreshControl={
                  <RefreshControl
                    style={{
                      flex: 1,
                      width: "100%",
                      height: "100%",
                      zIndex: 100,
                      backgroundColor: "red",
                    }}
                    refreshing={rloading}
                    tintColor="white"
                    onRefresh={fetchData}
                  />
                }
              />
            </View>
          ))
        ) : (
          <View
            style={{
              justifyContent: "center",
              height: "100%",
              width: "100%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => refresh()}
              style={{
                backgroundColor: Colors.primary,
                width: "80%",
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                borderRadius: 15,
              }}
            >
              <View>
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}
                >
                  NO INTERNET
                </Text>
                <Text>Click to Refresh</Text>
              </View>
              <View>
                <FontAwesome name="refresh" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "40%",
            left: "10%",
          }}
        >
          {image &&
            (Platform.OS === "ios" ? (
              <Uploading image={image} video={video} progress={progress} />
            ) : (
              // Some features of blur are not available on Android
              <UploadingAndroid
                image={image}
                video={video}
                progress={progress}
              />
            ))}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 8,
            width: "80%",
            borderRadius: 20,
            alignItems: "center",
            position: "absolute",
            top: heightPercentageToDP("82%"),
          }}
          onPress={() => setIsVisible(true)}
        >
          <Text style={{ color: "#fff", fontSize: 20, textAlign: "center" }}>
            {" "}
            Have you Brushed?{" "}
          </Text>
          <Text style={{ color: "#fff", fontSize: 15 }}>
            Send your picture to Receive Reward
          </Text>
        </TouchableOpacity>

        <PhotoPicker
          isVisible={isVisible}
          onBackdropPress={() => setIsVisible(false)}
          children={RenderInner()}
          childrenInput={
            <TextInput
              style={styles.input}
              placeholder="Paste your receiving Address"
              keyboardType="email-address"
              onChangeText={(text) => setaddress(text)}
            ></TextInput>
          }
        ></PhotoPicker>
      </View>
    </AuthContextProvider>
  );
};
export default home;
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    height: "100%",
  },
  uploadButton: {},
});
