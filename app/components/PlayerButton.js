import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import colors from "../misc/color";

const PlayerButton = ({ iconType, size = 40, color = colors.FONT, onPress, otherProps }) => {
  return (
    <MaterialCommunityIcons
      onPress={onPress}
      name={iconType}
      size={size}
      color={color}
      {...otherProps}
    />
  );
};

export default PlayerButton;
