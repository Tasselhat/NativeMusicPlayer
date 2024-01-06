import React from "react";
import { StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import { Entypo } from "@expo/vector-icons";
import color from "../misc/color";
import { Feather } from "@expo/vector-icons";
import { convertTime } from "../misc/helper";

const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying) {
    return <Feather name="pause" size={24} color={color.ACTIVE_FONT} />;
  }
  return <Feather name="play" size={24} color={color.ACTIVE_FONT} />;
};

const AudioListItem = ({
  title,
  duration,
  onOptionPress,
  onPlayPress,
  isPlaying,
  activeListItem,
}) => {
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onPlayPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                { backgroundColor: activeListItem ? color.ACTIVE_BG : color.FONT_LIGHT },
              ]}
            >
              {activeListItem ? (
                renderPlayPauseIcon(isPlaying)
              ) : (
                <Text style={styles.thumbnailText}>{title[0].toUpperCase()}</Text>
              )}
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text numberOfLines={1} style={styles.durationText}>
                {convertTime(duration)}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo onPress={onOptionPress} name="dots-three-vertical" size={24} color="black" />
        </View>
      </View>
      <View style={styles.separator}></View>
    </>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    width: width - 50,
    justifyContent: "center",
    padding: 10,
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    width: 50,
    backgroundColor: color.FONT_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    color: color.FONT,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: color.FONT,
  },
  separator: {
    width: width - 50,
    backgroundColor: "#333",
    height: 0.5,
    opacity: 0.5,
    alignSelf: "center",
  },
  durationText: {
    fontSize: 14,
    color: color.FONT_LIGHT,
    marginTop: 5,
  },
});

export default AudioListItem;
