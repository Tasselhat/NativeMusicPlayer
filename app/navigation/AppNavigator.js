import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import Playlist from "../screens/Playlist";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Audio Files"
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="headset" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Music Player"
        component={Player}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="compact-disc" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Playlists"
        component={Playlist}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-music" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
