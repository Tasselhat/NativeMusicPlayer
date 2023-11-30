import * as MediaLibrary from "expo-media-library";
import React, { Component, createContext } from "react";
import { Text, View, Alert } from "react-native";

export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
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
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    console.log(media);
    return media;
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
        this.permissionAlert();
      }
    }
    if (!permission.canAskAgain) {
      // display alert that user cannot use app without permissions
      this.permissionAlert();
    }
  };

  componentDidMount() {
    this.getPermission();
  }

  render() {
    return <AudioContext.Provider value={{}}>{this.props.children}</AudioContext.Provider>;
  }
}

export default AudioProvider;
