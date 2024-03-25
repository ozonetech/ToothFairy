import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  TouchableHighlight,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import CustomKeyboardView from "../components/CustomKeyboardView";
import Background from "../components/Background";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router } from "expo-router";

const ios = Platform.OS == "ios";

const forgetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, appResetPassword } = useAuth();

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef("");
  const PasswordRef = useRef("");

  const resetPassword = async () => {
    if (!email) {
      Alert.alert("Sign In", "Please fill all the fields!");
      return;
    }
    setLoading(true);
    const response = await appResetPassword(email);
    setLoading(false);
    if (response.success) {
      router.replace("login");
      console.log(response);
      Alert.alert("Reset Password Email Sent");
    } else {
      if (response.error) {
        // Check if error object exists
        console.log("Firebase Error Details:", response.Error); // Log the error details
        const errorCode = response.error.code;

        if (errorCode === "auth/invalid-email") {
          Alert.alert("Invalid Email", "Please enter a valid email address.");
        } else if (errorCode === "auth/user-not-found") {
          Alert.alert("User Not Found", "User not found");
        } else {
          Alert.alert("Error", `Error Code: ${errorCode}`);
        }
      } else {
        console.log("Unknown Error Details:", response); // Log unknown error details
        Alert.alert("Error", "An unknown error occurred");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <View style={styles.authHeader}>
        <Image
          resizeMode="contain"
          source={require("../assets/images/logo.png")}
          style={{ height: hp("10%") }}
        />
        <Text style={{ fontSize: 25, marginVertical: 10 }}>
          Welcome to ToothFairy
        </Text>
      </View>
      <CustomKeyboardView>
        <View style={styles.loginForm}>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
          ></TextInput>
          {loading ? (
            <View style={styles.loader}>
              <Loading />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => resetPassword()}
            >
              <Text style={{ color: "#fff", fontSize: 20 }}>
                Reset Password
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </CustomKeyboardView>
    </SafeAreaView>
  );
};

export default forgetPassword;

const styles = StyleSheet.create({
  container: { flex: 1, top: 100 },
  authHeader: {
    alignItems: "center",

    height: hp("15%"),
  },
  input: {
    width: "85%",
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#E2B801",
    paddingVertical: 15,
    marginVertical: 8,
  },
  inputBig: {
    width: "100%",
    fontSize: 20,
    borderWidth: 2,
    borderColor: "#E2B801",
    paddingVertical: "10%",
    textAlign: "auto",
  },
  loginForm: {
    alignItems: "center",
    top: hp("5%"),
    height: hp("100%"),
  },
  signupButton: {
    backgroundColor: "#E2B801",
    width: "85%",
    height: 50,
    marginVertical: hp("5%"),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  oauthButton: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
  },
});
