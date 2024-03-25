import { View, Text, TouchableOpacity } from "react-native";
import React, { Children } from "react";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";

const PhotoPicker = ({
  isVisible,
  onBackdropPress = () => {},
  height = "35%",
  children,
  childrenInput,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.4}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      backdropTransitionOutTiming={0}
      avoidKeyboard={true}
      hideModalContentWhileAnimating={true}
      animationInTiming={600}
      animationOutTiming={800}
      style={{ width: "100%", alignSelf: "center", margin: 0 }}
      onBackdropPress={() => onBackdropPress()}
      onBackButtonPress={() => onBackdropPress()}
    >
      <View
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          maxHeight: "100%",
          position: "absolute",
          width: "100%",
          paddingHorizontal: 20,
          justifyContent: "flex-end",
          height: height,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            height: 45,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          {childrenInput}
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            height: "100%",
            width: "100%",
            maxHeight: "80%",
            marginBottom: 15,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {children}
        </View>
        <TouchableOpacity
          onPress={() => onBackdropPress()}
          activeOpacity={0.6}
          style={{
            backgroundColor: "#fff",
            height: 45,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: Colors.light.tint,
              fontWeight: "600",
              fontSize: 20,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PhotoPicker;
