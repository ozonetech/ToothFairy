import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useAnimatedGestureHandler,
  withRepeat,
  withSequence,
  BounceIn,
  withSpring,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  RewardedInterstitialAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";

const FPS = 60;
const DELTA = 500 / FPS;
const BALL_WIDTH = 25;

const islandDimensions = { x: wp("35%"), y: 11, w: 127, h: 37 };

const normalizeVector = (vector) => {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
};

const radUnitId = "ca-app-pub-7891313948616469/7356218948";

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  radUnitId,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

export default function Game() {
  const { height, width } = useWindowDimensions();
  const playerDimensions = {
    w: width / 3,
    h: 37,
  };

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [speed, setSpeed] = useState(20);
  const [backgroundColor, setBackgroundColor] = useState("#042c6b");
  const { updateCoin } = useAuth();
  const [coinUpdatedAfterGameOver, setCoinUpdatedAfterGameOver] =
    useState(false);

  const targetPositionX = useSharedValue(width / 2);
  const targetPositionY = useSharedValue(height / 2);
  const direction = useSharedValue(normalizeVector({ x: 1, y: 1 }));
  const playerPos = useSharedValue({ x: width / 4, y: height - 100 });

  const [isLoading, setIsLoading] = useState(false);
  const [display, setDisplay] = useState("none");

  useEffect(() => {
    // Update display based on isLoading state
    setDisplay(isLoading ? "flex" : "none");
  }, [isLoading]);

  // useEffect(() => {
  const updateCoinBeforeGameOver = () => {
    if (gameOver && !coinUpdatedAfterGameOver) {
      // Update coin here using the current score
      // For example:
      const coinToAdd = score * 100; // Adjust this logic as per your requirement
      updateCoin(coinToAdd)
        .then(() => {
          console.log("Coin updated successfully before game over.");
          setCoinUpdatedAfterGameOver(true); // Set flag to true after updating coin
        })
        .catch((error) => {
          console.error("Error updating coin before game over:", error);
        });
    }
  };

  // Rewarded Ads

  const loadRewardInterstitial = () => {
    try {
      const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          setIsLoading(false);
        }
      );

      const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log(`User earned reward of ${reward.amount} ${reward.type}`);
          setIsLoading(true);
        }
      );

      const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          setIsLoading(false);
          rewardedInterstitial.load();
        }
      );

      rewardedInterstitial.load();

      return () => {
        unsubscribeClosed();
        unsubscribeEarned();
        unsubscribeLoaded();
      };
    } catch (error) {
      console.error("Error loading rewarded interstitial:", error);
    }
  };

  useEffect(() => {
    // Update display based on isLoading state
    setDisplay(isLoading ? "flex" : "none");
  }, [isLoading]);

  useEffect(() => {
    return loadRewardInterstitial();
  }, []);

  // banner ads
  const tadUnitId = __DEV__
    ? "ca-app-pub-8184917210189339/4699423560"
    : TestIds.ADAPTIVE_BANNER;

  //   // Call the function to update the coin before the game is over
  //
  // }, [gameOver, coinUpdatedAfterGameOver, score]); // Add dependencies to avoid unnecessary updates

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        update();
      }
    }, DELTA);

    return () => clearInterval(interval);
  }, [gameOver]);
  if (gameOver) {
    coin = score * 10;
  }

  const updatingCoin = () => {
    setIsLoading(true);
    try {
      rewardedInterstitial.show().then(() => {
        updateCoin(coin).then(() => {
          setIsLoading(false);
        });
      });
      // updateCoin(coin).then(() => {
      //   rewardedInterstitial.show();
      //   setIsLoading(false);
      // });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const update = () => {
    let nextPos = getNextPos(direction.value);
    let newDirection = direction.value;

    // Wall Hit detection
    if (nextPos.y > height - BALL_WIDTH) {
      setGameOver(true);
      setIsLoading(true);
      updatingCoin();
    }

    if (nextPos.y < 0) {
      newDirection = { x: direction.value.x, y: -direction.value.y };
    }

    if (nextPos.x < 0 || nextPos.x > width - BALL_WIDTH) {
      newDirection = { x: -direction.value.x, y: direction.value.y };
    }

    // Island Hit detection
    if (
      nextPos.x < islandDimensions.x + islandDimensions.w &&
      nextPos.x + BALL_WIDTH > islandDimensions.x &&
      nextPos.y < islandDimensions.y + islandDimensions.h &&
      BALL_WIDTH + nextPos.y > islandDimensions.y
    ) {
      if (
        targetPositionX.value < islandDimensions.x ||
        targetPositionX.value > islandDimensions.x + islandDimensions.w
      ) {
        newDirection = { x: -direction.value.x, y: direction.value.y };
      } else {
        newDirection = { x: direction.value.x, y: -direction.value.y };
      }
      setScore((s) => s + 1);

      // Generate a random color for the background
      const randomColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
      setBackgroundColor(randomColor);
    }

    // Player Hit detection
    if (
      nextPos.x < playerPos.value.x + playerDimensions.w &&
      nextPos.x + BALL_WIDTH > playerPos.value.x &&
      nextPos.y < playerPos.value.y + playerDimensions.h &&
      BALL_WIDTH + nextPos.y > playerPos.value.y
    ) {
      if (
        targetPositionX.value < playerPos.value.x ||
        targetPositionX.value > playerPos.value.x + playerDimensions.w
      ) {
        newDirection = { x: -direction.value.x, y: direction.value.y };
      } else {
        newDirection = { x: direction.value.x, y: -direction.value.y };
      }
    }

    direction.value = newDirection;
    nextPos = getNextPos(newDirection, speed);

    targetPositionX.value = withTiming(nextPos.x, {
      duration: DELTA,
      easing: Easing.linear,
    });
    targetPositionY.value = withTiming(nextPos.y, {
      duration: DELTA,
      easing: Easing.linear,
    });
  };

  const getNextPos = (direction) => {
    return {
      x: targetPositionX.value + direction.x * speed,
      y: targetPositionY.value + direction.y * speed,
    };
  };

  const restartGame = () => {
    targetPositionX.value = width / 2;
    targetPositionY.value = height / 2;
    setScore(0);
    setGameOver(false);
    setSpeed(20);
  };

  const ballAnimatedStyles = useAnimatedStyle(() => {
    return {
      top: targetPositionY.value,
      left: targetPositionX.value,
    };
  });

  const islandAnimatedStyles = useAnimatedStyle(
    () => ({
      width: withSequence(
        withTiming(islandDimensions.w * 1.3),
        withTiming(islandDimensions.w)
      ),
      height: withSequence(
        withTiming(islandDimensions.h * 1.3),
        withTiming(islandDimensions.h)
      ),
      opacity: withSequence(withTiming(0), withTiming(1)),
    }),
    [score]
  );

  const playerAnimatedStyles = useAnimatedStyle(() => ({
    left: playerPos.value.x,
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      playerPos.value = {
        ...playerPos.value,
        x: event.absoluteX - playerDimensions.w / 2,
      };
    },
  });

  return (
    <View style={[styles.container, {}]}>
      <View
        style={{
          backgroundColor: backgroundColor,
          opacity: 0.2,
          width: "100%",
          height: "100%",
        }}
      />
      <Text style={styles.score}>{score}</Text>
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOver}>Game over</Text>
          <Button title="Restart" onPress={restartGame} />
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: "blue",
              height: 30,
              elevation: 10,
              marginVertical: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.navigate("game")}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {!gameOver && <Animated.View style={[styles.ball, ballAnimatedStyles]} />}

      {/* Island */}
      <Animated.View
        // entering={BounceIn}
        duration={50}
        key={score}
        style={{
          position: "absolute",
          top: islandDimensions.y,
          left: islandDimensions.x,
          width: islandDimensions.w,
          height: islandDimensions.h,
          borderRadius: 20,
          backgroundColor: "black",
        }}
      />
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          alignItems: "center",
          justifyContent: "center",
          display: display,
        }}
      >
        <View style={{ width: "100%", alignItems: "center" }}>
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
          <Text
            style={{ color: "yellow", marginVertical: 10, fontWeight: "bold" }}
          >
            Wait Or{" "}
          </Text>
          <TouchableOpacity
            style={{
              width: "80%",
              backgroundColor: "red",
              height: 30,
              elevation: 10,
              marginVertical: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.navigate("game")}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Player */}
      <Animated.View
        style={[
          {
            top: playerPos.value.y,
            position: "absolute",
            width: playerDimensions.w,
            height: playerDimensions.h,
            borderRadius: 20,
            backgroundColor: backgroundColor,
          },
          playerAnimatedStyles,
        ]}
      />

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={{
            width: "100%",
            height: 200,
            position: "absolute",
            bottom: 0,
          }}
        />
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  ball: {
    backgroundColor: "black",
    width: BALL_WIDTH,
    aspectRatio: 1,
    borderRadius: 25,
    position: "absolute",
  },
  score: {
    fontSize: 150,
    fontWeight: "500",
    position: "absolute",
    top: 150,
    color: "lightgray",
  },
  gameOverContainer: {
    position: "absolute",
    top: 350,
  },
  gameOver: {
    fontSize: 50,
    fontWeight: "500",
    color: "red",
  },
});
