import React from "react";
import { StyleSheet, View } from "react-native";
import color from "../app/misc/color";

const Screen = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.APP_BG,
  },
});
