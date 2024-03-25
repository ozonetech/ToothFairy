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

const login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef("");
  const PasswordRef = useRef("");

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!emailRef.current || !PasswordRef.current) {
      Alert.alert("Sign In", "Please fill all the fields!");
      return;
    }
    setLoading(true);
    const response = await login(emailRef.current, PasswordRef.current);
    setLoading(false);
    if (!response.success) {
      Alert.alert("Sign IN", response.msg);
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
            onChangeText={(value) => (emailRef.current = value)}
          ></TextInput>
          <View style={styles.input}>
            <TextInput
              placeholder="****************"
              secureTextEntry={isPasswordShown}
              onChangeText={(value) => (PasswordRef.current = value)}
            ></TextInput>
            <View style={{ position: "absolute", right: wp("5%"), top: 10 }}>
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
              >
                {isPasswordShown == true ? (
                  <Ionicons name="eye-off" size={24} color={"black"} />
                ) : (
                  <Ionicons name="eye" size={24} color={"black"} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.navigate("forgetPassword")}
            style={{ marginTop: 20, marginBottom: -10 }}
          >
            <Text>Forget Password?</Text>
          </TouchableOpacity>
          {loading ? (
            <View style={styles.loader}>
              <Loading />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => handleLogin()}
            >
              <Text style={{ color: "#fff", fontSize: 20 }}>LOG IN</Text>
            </TouchableOpacity>
          )}
          <Text>Or</Text>
          <View style={styles.oauthButton}>
            <TouchableOpacity>
              <Image
                style={{ height: hp("5%"), width: wp("10%") }}
                resizeMode="cover"
                source={require("../assets/images/facebookIcon.png")}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={{ height: hp("5%"), width: wp("10%") }}
                source={require("../assets/images/googleIcon.png")}
              ></Image>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Don't Have an Account?</Text>
            <TouchableOpacity onPress={() => router.push("signUp")}>
              <Text style={{ marginLeft: 5, fontSize: 18, color: "#E2B801" }}>
                Sign UP{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyboardView>
    </SafeAreaView>
  );
};

export default login;

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
