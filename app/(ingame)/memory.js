/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Board } from "./src/components/Board";
import { GAP_SIZE, useCardSize } from "./src/style/sizes";
import { game } from "./src/game/Game";
import { observer } from "mobx-react-lite";
import { WinOverlayTouch } from "./src/components/WinOverlayTouch";
import { useIsPortrait } from "./src/util/useIsPortrait";
import { Color } from "./src/style/Color";
import { InfoModal } from "./src/components/InfoModal";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/authContext";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

const App = observer(() => {
  const { updateCoin, user } = useAuth();
  const [totalBalance, setTotalBalance] = useState(0);
  const isDarkMode = useColorScheme() === "dark";
  const isPortrait = useIsPortrait();
  const { boardSize } = useCardSize();
  const [isLoading, setIsLoading] = useState(false);
  const [display, setDisplay] = useState("none");

  useEffect(() => {
    // Update display based on isLoading state
    setDisplay(isLoading ? "flex" : "none");
  }, [isLoading]);

  useEffect(() => {
    if (game.isCompleted) {
      setIsLoading(true);
      updateCoin(100).then(setIsLoading(false));
    }
  }, [game.isCompleted]);

  const [showInfoModal, setShowInfoModal] = React.useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const textStyleTop = { fontSize: isPortrait ? 22 : 18 };
  const textStyleBottom = { fontSize: isPortrait ? 24 : 20 };
  const row2Style = {
    marginTop: isPortrait ? 12 : 3,
    marginBottom: isPortrait ? 15 : 2,
  };

  React.useEffect(() => {
    game.startGame();
  }, []);

  return (
    <SafeAreaView style={[styles.fullHeight, { backgroundColor: "#000" }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={[styles.container]}>
        <Pressable
          style={({ pressed }) => [
            styles.infoPressable,
            {
              backgroundColor: pressed ? Color.teal : "#fff",
            },
          ]}
          onPress={() => {
            setShowInfoModal(true);
          }}
        >
          <Text style={[styles.infoText, textStyleTop]}>i</Text>
        </Pressable>
        <View style={styles.spaceTop} />

        <View
          style={[
            styles.row2,
            row2Style,
            { width: boardSize, flexDirection: "row" },
          ]}
        >
          <View>
            <Text
              style={[
                styles.textBottom,
                textStyleBottom,
                { color: "yellow", fontSize: 30 },
              ]}
            >
              {game.moves} moves
            </Text>
            <Text style={[styles.textBottom, { fontSize: 35 }]}>
              {game.timer.seconds} s
            </Text>
          </View>
          <View>
            <Pressable
              style={({ pressed }) => [
                styles.restartPressable,
                {
                  backgroundColor: pressed ? Color.blue : "#aea41e",
                },
              ]}
              onPress={() => router.navigate("game")}
            >
              <Text style={[styles.restartText, textStyleTop]}>Back</Text>
            </Pressable>
          </View>
        </View>
        <Board cards={game.cards} />
        <View style={styles.spaceBottom} />
      </View>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          marginTop: 120,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          alignItems: "center",
          justifyContent: "center",
          display: display,
        }}
      >
        <LottieView
          style={{ height: 200, width: 200 }}
          source={require("../../assets/lottie/coinLoading.json")}
          autoPlay
          loop
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Please Wait ...
        </Text>
        <Text style={{ color: "#fff" }}>
          Adding your Earnings to your wallet
        </Text>
      </View>

      {game.isCompleted && (
        <WinOverlayTouch
          game={game}
          onClose={() => {
            game.startGame();
          }}
        />
      )}

      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  fullHeight: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  spaceTop: {
    flex: 4,
  },
  spaceBottom: {
    flex: 1,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: GAP_SIZE * 1.5,
    marginBottom: 20,
  },
  row2: {
    justifyContent: "space-between",
    paddingHorizontal: GAP_SIZE,
    bottom: "15%",
    alignItems: "center",
  },
  title: {
    textAlignVertical: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  textBottom: {
    fontWeight: "bold",
    color: "#fff",
  },
  infoPressable: {
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    height: 35,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "#aea41e",
    zIndex: 10,
    top: "10%",
    left: "37%",
  },
  infoText: {
    fontWeight: "600",
    color: "#aea41e",
  },
  restartPressable: {
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingBottom: 5,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: Color.white,
  },
  restartText: {
    color: Color.white,
  },
  textStyleTop: {
    color: "#fff",
  },
});

export default App;
