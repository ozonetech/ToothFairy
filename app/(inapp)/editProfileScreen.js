import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
// import Toast from "react-native-toast-message";
import { AuthContextProvider, useAuth } from "../../context/authContext";
import colors from "../../constants/Colors";
import PhotoPicker from "../../components/PhotoPicker";
import Background from "@/components/Background";
import { heightPercentageToDP } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = () => {
  const { logout, user, uploadImageToProfile, updateProfileDetails } =
    useAuth();
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState("");
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [name, setName] = useState(false);
  const [email, setEmail] = useState(false);
  const [jumpNumber, setJumpNumber] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageChangeLoading, setImageChangeLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };
  const options = ["Take Photo", "Choose Photo"];

  // getting user information

  useFocusEffect(
    React.useCallback(() => {
      const getUserInformation = async () => {
        try {
          // fetching users saved location ID's
          const currentUser = auth.currentUser;

          const userId = currentUser.uid;

          const userDocRef = doc(db, "users", userId);
          const userDocSnap = await getDoc(userDocRef);
          const userDocData = userDocSnap.data();

          if (userDocData) {
            const { profileImage, name } = userDocData;
            if (profileImage) {
              setImage(profileImage);
            }
            setName(name);
          } else {
            return;
          }
        } catch (e) {
          console.error(e);
        }
      };
      getUserInformation();
    }, [])
  );

  // if choosing new image from camera roll this function opens album
  const pickImage = async () => {
    setSubmitLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        const fileName = uri.split("/").pop();
        const uploadResp = await uploadImageToProfile(uri, fileName);
        setImage(uri);
        setImageChangeLoading(false);
        hideModal();
        // Toast.show({
        //   type: "success", // You can customize the type (success, info, error, etc.)
        //   text1: "New Profile image set",
        //   position: "top",
        // });
      }
    } catch (e) {
      setSubmitLoading(false);
    }
  };

  // if taking image this function opens the camera
  const takePhoto = async () => {
    setSubmitLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        aspect: [3, 4],
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        const fileName = uri.split("/").pop();
        const uploadResp = await uploadImageToProfile(uri, fileName);
        setSubmitLoading(false);
        setImage(uri);
        hideModal();
        // Toast.show({
        //   type: "Success", // You can customize the type (success, info, error, etc.)
        //   text1: "New Profile image set",
        //   position: "top",
        // });
      }
    } catch (e) {
      setSubmitLoading(false);
    } finally {
    }
  };

  // when edit image button clicked in editprofile screen
  // checks/asks for permission before opening the modal to change the image
  const editProfileImage = async () => {
    if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
      requestPermission();
      showModal();
    } else {
      showModal();
    }
  };

  const RenderInner = () => (
    <View style={styles.panel}>
      {!imageChangeLoading ? (
        <>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIsVisible(false);
                    if (index == 1) {
                      pickImage();
                    }
                    if (index == 0) {
                      takePhoto();
                    }
                  }}
                  style={{
                    width: "100%",
                    height: 55,
                    marginBottom: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.light.tint,
                      fontWeight: "600",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
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

  return (
    <>
      <Background></Background>
      <View style={styles.container}>
        <View style={styles.profilePhoto}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                alignSelf: "center",
                marginBottom: 10,
              }}
              source={image ? { uri: image } : null}
            />
            <TouchableOpacity
              onPress={() => setIsVisible(true)}
              style={{
                borderWidth: 2,
                borderColor: colors.light.primary,
                borderRadius: 20,
                top: -40,
                left: 25,
                backgroundColor: colors.light.black,
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome name="camera" size={18} color="white" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
              {name}
            </Text>
            <Text style={{ fontSize: 15, marginBottom: 5 }}>
              Coin Available {user?.coin}
            </Text>
          </View>
        </View>
        <View style={styles.editForm}>
          <View style={styles.action}>
            <FontAwesome name="user-o" size={20} />
            <TextInput
              placeholder="Name"
              placeholderTextColor="#666666"
              autoCorrect={false}
              style={[styles.textInput]}
              onChangeText={(text) => setName(text)}
            />
            {/* </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" size={20} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCorrect={false}
            style={[styles.textInput]}
            onChangeText={(text) => setEmail(text)}
          /> */}
          </View>
          {/* <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder="Total BASE jumps"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[styles.textInput]}
            keyboardType="numeric"
            onChangeText={(text) => setJumpNumber(text)}
          />
        </View> */}
          {submitLoading ? (
            <ActivityIndicator color={"red"} size={"large"} />
          ) : (
            <TouchableOpacity
              style={styles.commandButton}
              onPress={() => {
                setSubmitLoading(true);
                updateProfileDetails(name, email);
                setSubmitLoading(false);
              }}
            >
              <Text style={styles.panelButtonTitle}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>

        <PhotoPicker
          isVisible={isVisible}
          onBackdropPress={() => setIsVisible(false)}
          children={RenderInner()}
        ></PhotoPicker>
      </View>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: heightPercentageToDP("20%"),
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#00ABF0",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#00ABF0",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    height: 50,
    alignItems: "center",
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
  },
  editForm: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    justifyContent: "center",
  },
});
