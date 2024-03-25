import { View, Text } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { AuthContextProvider, useAuth } from "../context/authContext";

const CustomDrawerContent = (props: any) => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label={"LogOut"} onPress={() => handleLogout()} />
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawerContent;
