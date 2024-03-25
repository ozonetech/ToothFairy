import "react-native-gesture-handler";
import {
  View,
  Text,
  Image,
  Alert,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Slot, Stack, Tabs, router } from "expo-router";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

import { AuthContextProvider, useAuth } from "../../context/authContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import image from "../(inapp)/editProfileScreen";

import { doc, getDoc } from "firebase/firestore";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Colors from "@/constants/Colors";

function CustomDrawerContent(props: any) {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignSelf: "center",
              marginBottom: 10,
            }}
            source={{
              uri: user?.profileImage,
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
            {user?.name}
          </Text>
          <Text
            style={{
              fontSize: 17,
              marginBottom: 5,
              color: Colors.primary,
              fontWeight: "bold",
            }}
          >
            Available Coin {user?.coin}
          </Text>
        </View>
        <DrawerItemList {...props} />
        <View
          style={{
            marginTop: hp("20%"),
            backgroundColor: "#C27B05",
          }}
        >
          <DrawerItem
            labelStyle={{ color: "#fff", alignItems: "center" }}
            label={"LogOut"}
            onPress={() => handleLogout()}
            style={{}}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

export default function _layout() {
  const { top, bottom } = useSafeAreaInsets();
  const { logout, user, refresh } = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          initialRouteName="home"
          drawerContent={CustomDrawerContent}
          screenOptions={{
            drawerActiveBackgroundColor: "#C27B05",
            drawerActiveTintColor: "#fff",
            drawerInactiveBackgroundColor: "#E2B801",
            drawerLabelStyle: { fontSize: 18, marginLeft: -18 },
            drawerInactiveTintColor: "#fff",
          }}
        >
          <Drawer.Screen
            name="home"
            options={{
              drawerLabel: "Home",
              headerTitle: "Tooth Fairy",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => refresh()}
                  style={{ paddingHorizontal: 20, alignItems: "center" }}
                >
                  <Entypo name="home" size={24} color={"#000"} />
                </TouchableOpacity>
              ),
              drawerIcon: ({ size, color }) => (
                <Entypo name="home" size={size} color={color} />
              ),
            }}
          ></Drawer.Screen>

          <Drawer.Screen
            name="News"
            options={{
              drawerLabel: "News",
              headerTitle: "News Extra",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => router.navigate("home")}
                  style={{ paddingHorizontal: 20, alignItems: "center" }}
                >
                  <Entypo name="home" size={24} color={"#000"} />
                </TouchableOpacity>
              ),
              drawerIcon: ({ size, color }) => (
                <FontAwesome name="newspaper-o" size={size} color={color} />
              ),
            }}
          ></Drawer.Screen>

          <Drawer.Screen
            name="profileScreen"
            options={{
              drawerLabel: "My Profile",
              headerTitle: "Profile",
              headerStyle: {
                backgroundColor: "rgba(133 76 14 / 0.5)",
              },
              headerRight: () => (
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    alignItems: "center",
                  }}
                >
                  <Entypo name="home" size={24} color={"#000"} />
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginLeft: 10,
                    }}
                    source={{
                      uri: user?.profileImage,
                    }}
                  />
                </View>
              ),
              drawerIcon: ({ size, color }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          ></Drawer.Screen>

          <Drawer.Screen
            name="coinScreen"
            options={{
              drawerLabel: "Crypto Market",
              headerTitle: "Crypto Market",
              drawerIcon: ({ size, color }) => (
                <FontAwesome5 name="bitcoin" size={size} color={color} />
              ),
            }}
          ></Drawer.Screen>
          <Drawer.Screen
            name="game"
            options={{
              drawerLabel: "Game House",
              headerShown: false,
              drawerIcon: ({ size, color }) => (
                <FontAwesome name="gamepad" size={size} color={color} />
              ),
            }}
          ></Drawer.Screen>
          <Drawer.Screen
            name="aboutScreen"
            options={{
              drawerLabel: "About Us",
              headerTitle: "About Us",
              drawerIcon: ({ size, color }) => (
                <FontAwesome name="gamepad" size={size} color={color} />
              ),
            }}
          ></Drawer.Screen>
          <Drawer.Screen
            name="NewsDetails"
            options={{
              drawerItemStyle: { display: "none" },
            }}
          ></Drawer.Screen>
        </Drawer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
