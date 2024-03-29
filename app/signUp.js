import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { Button } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { useAuth } from "../context/authContext";
import Background from "../components/Background";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router } from "expo-router";

const ios = Platform.OS == "ios";

const signUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState();
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { register } = useAuth();

  const emailRef = useRef("");
  const PasswordRef = useRef("");
  const usernameRef = useRef("");
  const ageRef = useRef("");
  const nameRef = useRef("");
  const countryRef = useRef("");
  const interestRef = useRef("");
  const profileImageRef = useRef(
    "https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png"
  );
  const coinRef = useRef(20);

  const handleRegister = async () => {
    if (!emailRef.current || !PasswordRef.current || !usernameRef.current) {
      Alert.alert("Sign In", "Please fill all the fields!");
      return;
    }
    setLoading(true);
    let response = await register(
      nameRef.current,
      emailRef.current,
      usernameRef.current,
      ageRef.current,
      PasswordRef.current,
      interestRef.current,
      countryRef.current,
      profileImageRef.current,
      coinRef.current
    );
    setLoading(false);

    if (!response.success) {
      const errorCode = response.msg;
      console.log(response.msg);
      Alert.alert("Sign Up", response.msg);
      if (errorCode === "auth/username-taken") {
        Alert.alert(
          "Username Taken",
          "The username you entered is already in use. Please choose a different username."
        );
      }
    }
  };

  const router = useRouter();
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
            placeholder="Name"
            onChangeText={(value) => (nameRef.current = value)}
            keyboardType="default"
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(value) => (emailRef.current = value)}
            keyboardType="email-address"
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(value) => (usernameRef.current = value)}
            keyboardType="default"
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Age"
            onChangeText={(value) => (ageRef.current = value)}
            keyboardType="number-pad"
          ></TextInput>
          <View style={styles.input}>
            <TextInput
              style={{ fontSize: 20 }}
              placeholder="Password"
              secureTextEntry={isPasswordShown}
              onChangeText={(value) => (PasswordRef.current = value)}
            ></TextInput>
            <View
              style={{
                position: "absolute",
              }}
            >
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={{
                  position: "absolute",
                  left: wp("75%"),
                  top: hp("0.5%"),
                  padding: 5,
                }}
              >
                {isPasswordShown == true ? (
                  <Ionicons name="eye-off" size={24} color={"black"} />
                ) : (
                  <Ionicons name="eye" size={24} color={"black"} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Country"
            onChangeText={(value) => (countryRef.current = value)}
            keyboardType="default"
          ></TextInput>
          <View style={{ width: "85%", marginVertical: 8 }}>
            <Text style={{ textAlign: "left", fontSize: 18, color: "grey" }}>
              Interest in ToothFairy
            </Text>
            <TextInput
              style={styles.inputBig}
              keyboardType="default"
              multiline={true}
              onChangeText={(value) => (interestRef.current = value)}
            ></TextInput>
          </View>
          {loading ? (
            <View style={styles.loader}>
              <Loading />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => handleRegister()}
            >
              <Text style={{ color: "#fff", fontSize: 20 }}>SIGN UP</Text>
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
            <Text>Already have an Account?</Text>
            <TouchableOpacity onPress={() => router.push("login")}>
              <Text style={{ marginLeft: 5, fontSize: 18, color: "#E2B801" }}>
                Sign IN{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyboardView>
    </SafeAreaView>
  );
};

export default signUp;

const styles = StyleSheet.create({
  container: { flex: 1, top: hp("1%"), marginBottom: 30 },
  authHeader: {
    alignItems: "center",

    height: hp("15%"),
  },
  input: {
    width: "85%",
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#E2B801",
    paddingVertical: 8,
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
    marginTop: 10,
  },
  signupButton: {
    backgroundColor: "#E2B801",
    width: "85%",
    height: 50,
    marginVertical: 10,
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
