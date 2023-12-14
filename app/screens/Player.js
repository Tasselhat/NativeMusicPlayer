import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Screen from "../../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Player = ({}) => {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>1 / 99</Text>
        <View style={styles.midBanner}>
          <MaterialCommunityIcons name="music-circle" size={90} color={color.ACTIVE_BG} />
        </View>
        <View style={styles.audioPlayer}>
          <Text style={styles.audioFilename}>Audio File Name</Text>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  audioCount: {
    fontSize: 24,
    textAlign: "right",
    color: color.FONT_MEDIUM,
    padding: 15,
  },
  midBanner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Player;
