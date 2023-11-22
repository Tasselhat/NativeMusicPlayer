import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import icons from "../../assets/icons";
import styles from "./screenheader.style";

const ScreenHeaderBtn = ({ dimension, handlePress }) => {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={handlePress}>
      <Image source={icons.menu} contentFit="cover" style={styles.btnImg(dimension)} />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
