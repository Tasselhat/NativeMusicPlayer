import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Screen from "../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import { play, pause, resume } from "../controller/audioController";

const { width } = Dimensions.get("window");

const Player = ({}) => {
  const context = useContext(AudioContext);

  const { playbackPosition, playbackDuration } = context;

  const calculateSeekbar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };

  const handlePlayPress = async () => {
    const { soundObj, playbackObj, currentAudio, updateState } = context;
    if (soundObj === null) {
      const status = await play(playbackObj, currentAudio.uri);
      return updateState(context, {
        soundObj: status,
        currentAudio: currentAudio,
        isPlaying: true,
        currentAudioIndex: context.currentAudioIndex,
      });
    }
    if (soundObj && soundObj.isPlaying) {
      const status = await pause(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: false,
      });
    }
    if (soundObj && !soundObj.isPlaying) {
      const status = await resume(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: true,
      });
    }
  };

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  if (!context.currentAudio) return null;

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1}/${
          context.totalAudioCount
        }`}</Text>
        <View style={styles.midBanner}>
          <MaterialCommunityIcons
            name="music-circle"
            size={200}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayer}>
          <Text numberOfLines={1} style={styles.audioFilename}>
            {context.currentAudio.filename}
          </Text>
          <Slider
            style={{ width: width - 100, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekbar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="shuffle-variant" />
            <PlayerButton iconType="skip-backward" />
            <PlayerButton
              onPress={handlePlayPress}
              iconType={context.isPlaying ? "pause" : "play"}
              size={70}
            />
            <PlayerButton iconType="skip-forward" />
            <PlayerButton iconType="repeat" />
          </View>
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
  audioPlayer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  audioFilename: {
    fontSize: 16,
    color: color.FONT,
    textAlign: "center",
    paddingVertical: 20,
  },
  audioControllers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width - 100,
  },
});

export default Player;
