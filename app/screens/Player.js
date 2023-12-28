import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Screen from "../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import { play, pause, resume, playNext } from "../controller/audioController";
import { convertTime, storeAudioForNextOpening } from "../misc/helper";

const { width } = Dimensions.get("window");

const Player = ({}) => {
  const context = useContext(AudioContext);

  const { playbackPosition, playbackDuration } = context;

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };

  const handlePlayPress = async () => {
    const { soundObj, playbackObj, currentAudio, updateState, onPlaybackStatusUpdate } = context;
    if (soundObj === null) {
      const status = await play(playbackObj, currentAudio.uri);
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return updateState(context, {
        soundObj: status,
        currentAudio: currentAudio,
        isPlaying: true,
        currentAudioIndex: context.currentAudioIndex,
      });
    }
    //pause
    if (soundObj && soundObj.isPlaying) {
      const status = await pause(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: false,
      });
    }
    //resume
    if (soundObj && !soundObj.isPlaying) {
      const status = await resume(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: true,
      });
    }
  };

  handleRandomizePress = () => {
    const { randomize, updateState } = context;
    updateState(context, {
      randomize: !randomize,
    });
  };

  const handleNextPress = async () => {
    const { playbackObj, updateState, audioFiles, currentAudioIndex } = context;
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;
    let audio = audioFiles[currentAudioIndex + 1];
    let status;
    let index;

    if (!isLoaded && !isLastAudio) {
      index = currentAudioIndex + 1;
      status = await play(playbackObj, audio.uri);
    }

    if (isLoaded && !isLastAudio) {
      index = currentAudioIndex + 1;
      status = await playNext(context.playbackObj, audio.uri);
    }

    if (isLastAudio) {
      index = 0;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  };

  const handlePreviousPress = async () => {
    const { playbackObj, updateState, audioFiles, currentAudioIndex, totalAudioCount } = context;
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isFirstAudio = currentAudioIndex <= 0;
    let audio = audioFiles[currentAudioIndex - 1];
    let status;
    let index;

    if (!isLoaded && !isFirstAudio) {
      index = currentAudioIndex - 1;
      status = await play(playbackObj, audio.uri);
    }

    if (isLoaded && !isFirstAudio) {
      index = currentAudioIndex - 1;
      status = await playNext(playbackObj, audio.uri);
    }

    if (isFirstAudio) {
      index = totalAudioCount - 1;
      audio = audioFiles[index];
      if (isLoaded) {
        status = await playNext(playbackObj, audio.uri);
      } else {
        status = await play(playbackObj, audio.uri);
      }
    }

    updateState(context, {
      currentAudio: audio,
      playbackObj: playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <Text>{convertTime(context.currentAudio.duration)}</Text>
          </View>
          <Slider
            style={{ width: width - 100, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="shuffle-variant" />
            <PlayerButton onPress={handlePreviousPress} iconType="skip-backward" size={50} />
            <PlayerButton
              onPress={handlePlayPress}
              iconType={context.isPlaying ? "pause" : "play"}
              size={70}
            />
            <PlayerButton onPress={handleNextPress} iconType="skip-forward" size={50} />
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
