import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import Background from "../components/Background";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { router } from "expo-router";

const ios = Platform.OS == "ios";

const index = () => {
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
          <TextInput style={styles.input} placeholder="Email"></TextInput>

          <TextInput style={styles.input} placeholder="Password"></TextInput>
          <TouchableOpacity style={styles.signupButton}>
            <Text style={{ color: "#fff", fontSize: 20 }}>LOG IN</Text>
          </TouchableOpacity>
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
                Sign UP{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyboardView>
    </SafeAreaView>
  );
};

export default index;

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
