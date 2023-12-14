import * as MediaLibrary from "expo-media-library";
import React, { Component, createContext } from "react";
import { Text, View, Alert } from "react-native";
import { DataProvider } from "recyclerlistview";

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
    };
  }

  permissionAlert = () => {
    Alert.alert("Permission Required", "This app requires access to audio files to play audio.", [
      {
        text: "Allow File Access",
        onPress: () => this.getPermission(),
      },
      {
        text: "Cancel",
        onPress: () => this.permissionAlert(),
      },
    ]);
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
    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]),
      audioFiles: [...audioFiles, ...media.assets],
    });
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
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
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

  componentDidMount() {
    this.getPermission();
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
    } = this.state;

    if (permissionError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 25, textAlign: "center" }}>
            You must enable access to audio files to use this app, please allow access to music and
            files in app settings and restart the app.
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
          updateState: this.updateState,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
