import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import PlayerButton from "../components/PlayerButton";
import Screen from "../components/Screen";
import { AudioContext } from "../context/AudioProvider";
import {
  pause,
  nextAudioPress,
  previousAudioPress,
  selectAudio,
  resume,
  seek,
} from "../controller/audioController";
import color from "../misc/color";
import { convertTime } from "../misc/helper";

const { width } = Dimensions.get("window");

const Player = ({}) => {
  const context = useContext(AudioContext);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [sliderThumbColor, setSliderThumbColor] = useState(color.FONT_MEDIUM);

  const { playbackPosition, playbackDuration } = context;

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };

  const handlePlayPress = async () => {
    await selectAudio(context.currentAudio, context);
  };

  const handleRandomizePress = () => {
    const { randomize, updateState } = context;
    updateState(context, {
      randomize: !randomize,
    });
  };

  const handleNextPress = async () => {
    await nextAudioPress(context);
  };

  const handlePreviousPress = async () => {
    await previousAudioPress(context);
  };

  const renderTime = () => {
    return convertTime(context.playbackPosition / 1000);
  };

  useEffect(() => {
    context.loadPreviousAudio();
    if (context.isPlaying) {
      setSliderThumbColor(color.ACTIVE_BG);
    } else {
      setSliderThumbColor(color.FONT_MEDIUM);
    }
  }, [context.isPlaying]);

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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <Text>{currentPosition ? currentPosition : renderTime() || "00:00"} / </Text>
            <Text>{convertTime(context.currentAudio.duration)}</Text>
          </View>
          <Slider
            style={{ width: width - 100, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            onValueChange={(value) => {
              setCurrentPosition(convertTime(value * context.currentAudio.duration));
            }}
            onSlidingStart={async () => {
              setSliderThumbColor(color.SECONDARY);
              if (!context.isPlaying) {
                return;
              }
              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log("Error inside onSlidingStart", error.message);
              }
            }}
            onSlidingComplete={async (value) => {
              setSliderThumbColor(color.FONT_MEDIUM);
              await seek(context, value);
              setCurrentPosition(null);
            }}
            thumbTintColor={sliderThumbColor}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
          />
          <View style={styles.audioControllers}>
            <PlayerButton
              onPress={handleRandomizePress}
              iconType="shuffle-variant"
              color={context.randomize ? color.ACTIVE_BG : color.FONT_MEDIUM}
            />
            <PlayerButton onPress={handlePreviousPress} iconType="skip-backward" size={50} />
            <PlayerButton
              onPress={handlePlayPress}
              iconType={context.isPlaying ? "pause" : "play"}
              size={70}
            />
            <PlayerButton onPress={handleNextPress} iconType="skip-forward" size={50} />
            <PlayerButton
              iconType="repeat"
              color={context.repeat ? color.ACTIVE_BG : color.FONT_MEDIUM}
            />
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
