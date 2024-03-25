import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Color } from "../style/Color";
import React from "react";

interface Props {
  /** Invoked when the close button is pressed. */
  onClose: () => void;
}

export function InfoModal({ onClose }: Props) {
  return (
    <Modal animationType="slide">
      <View style={styles.modalContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.closePressable,
            {
              backgroundColor: pressed ? Color.redLight : Color.red,
            },
          ]}
          onPress={onClose}
        >
          <Text style={styles.closeText} accessibilityHint="Close">
            X
          </Text>
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Hi!</Text>
          <Text style={styles.text}>
            A matching card game is a type of puzzle game where players are
            presented with a grid of facedown cards. The objective of the game
            is to uncover pairs of matching cards by flipping them over two at a
            time. Players typically take turns flipping pairs of cards, aiming
            to find matches by remembering the positions of previously revealed
            cards.
          </Text>
          <Text style={styles.text}>
            When a player successfully matches two cards, they remain face-up on
            the grid. The game continues until all pairs of cards have been
            matched, and the player with the most matches at the end of the game
            wins.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 40,
    backgroundColor: "#fff",
  },
  closePressable: {
    backgroundColor: Color.red,
    alignSelf: "flex-end",
    width: 50,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 20,
    color: "#fff",
  },
  textContainer: {
    flex: 0.75,
    justifyContent: "center",
  },
  text: {
    color: Color.dark,
    fontSize: 18,
    marginBottom: 15,
  },
  link: {
    textDecorationLine: "underline",
  },
});
