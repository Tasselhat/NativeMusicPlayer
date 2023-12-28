import * as MediaLibrary from "expo-media-library";
import React, { Component, createContext } from "react";
import { Text, View, Alert } from "react-native";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
      randomize: false,
    };
    this.totalAudioCount = null;
  }

  permissionAlert = () => {
    Alert.alert(
      "Permission Required",
      "This app requires access to audio files to play audio.",
      [
        {
          text: "Allow File Access",
          onPress: () => this.getPermission(),
        },
        {
          text: "Cancel",
          onPress: () => this.permissionAlert(),
        },
      ]
    );
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;
    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio");
    let currentAudio, currentAudioIndex;

    if (previousAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  getPermission = async () => {
    // {"canAskAgain": true, "expires": "never", "granted": false, "status": "undetermined"}
    const permission = await MediaLibrary.getPermissionsAsync();
    console.log(permission);
    if (permission.granted) {
      //get all audio files
      this.getAudioFiles();
      return true;
    }
    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        // display alert that user must allow permissions
        this.permissionAlert();
      }
      if (status === "granted") {
        //get audio files
        this.getAudioFiles();
        return true;
      }
      if (status === "denied" && !canAskAgain) {
        // display alert that user must allow permissions to proceed
        this.setState({ ...this.state, permissionError: true });
      }
    }
    if (!permission.canAskAgain) {
      // display alert that user cannot use app without permissions
      this.setState({ ...this.state, permissionError: true });
    }
  };

  onPlaybackStatusUpdate = async (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }

    if (playbackStatus.didJustFinish && !this.state.randomize) {
      const nextAudioIndex = this.state.currentAudioIndex + 1;
      //there is no next audio to play or the current audio is the last one
      if (nextAudioIndex >= this.totalAudioCount) {
        this.state.playbackObj.unloadAsync();
        this.updateState(this, {
          soundObj: null,
          currentAudio: this.state.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
        return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
      }
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await play(this.state.playbackObj, audio.uri);
      return this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
    } else if (playbackStatus.didJustFinish && this.state.randomize) {
      let nextAudioIndex = Math.floor(Math.random() * this.totalAudioCount) + 1;
      while (nextAudioIndex === this.state.currentAudioIndex) {
        nextAudioIndex = Math.floor(Math.random() * this.totalAudioCount) + 1;
      }
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await play(this.state.playbackObj, audio.uri);
      return this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
    }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackDuration,
      playbackPosition,
      randomize,
    } = this.state;

    if (permissionError) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 25, textAlign: "center" }}>
            You must enable access to audio files to use this app, please allow
            access to music and files in app settings and restart the app.
          </Text>
        </View>
      );
    }

    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          playbackDuration,
          playbackPosition,
          randomize,
          totalAudioCount: this.totalAudioCount,
          loadPreviousAudio: this.loadPreviousAudio,
          updateState: this.updateState,
          playbackStatusUpdate: this.onPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
