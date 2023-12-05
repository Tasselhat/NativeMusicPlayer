import React from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { LayoutProvider, RecyclerListView } from "recyclerlistview";
import AudioListItem from "../../components/AudioListItem";
import Screen from "../../components/Screen";
import OptionsModal from "../../components/OptionsModal";
import { Audio } from "expo-av";

export class AudioList extends React.Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
    };
    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dimension) => {
      switch (type) {
        case "audio":
          dimension.width = Dimensions.get("window").width;
          dimension.height = 70;
          break;
        default:
          dimension.width = 0;
          dimension.height = 0;
      }
    }
  );

  handleAudioPress = async (audio) => {
    //first play
    if (this.state.soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await playbackObj.loadAsync({ uri: audio.uri }, { shouldPlay: true });
      return this.setState({
        ...this.state,
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status,
      });
    }

    //new song
    if (this.state.soundObj.isLoaded && this.state.currentAudio.id !== audio.id) {
      const status = await this.state.playbackObj.unloadAsync();
      const playbackObj = new Audio.Sound();
      const status2 = await playbackObj.loadAsync({ uri: audio.uri }, { shouldPlay: true });
      return this.setState({
        ...this.state,
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status2,
      });
    }

    //pause
    if (this.state.soundObj.isLoaded && this.state.soundObj.isPlaying) {
      const status = await this.state.playbackObj.setStatusAsync({ shouldPlay: false });
      return this.setState({ ...this.state, soundObj: status });
    }

    //resume
    if (
      this.state.soundObj.isLoaded &&
      !this.state.soundObj.isPlaying &&
      this.state.currentAudio.id === audio.id
    ) {
      const status = await this.state.playbackObj.playAsync();
      return this.setState({ ...this.state, soundObj: status });
    }
  };

  rowRenderer = (type, item, index) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onPlayPress={() => {
          this.handleAudioPress(item);
        }}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({
            ...this.state,
            optionModalVisible: true,
          });
        }}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider }) => {
          return (
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
              }}
            >
              <Text style={styles.TitleText}>Audio Files:</Text>
              <Screen>
                <RecyclerListView
                  dataProvider={dataProvider}
                  layoutProvider={this.layoutProvider}
                  rowRenderer={this.rowRenderer}
                />
                <OptionsModal
                  title={this.currentItem?.filename}
                  onClose={() => this.setState({ ...this.state, optionModalVisible: false })}
                  visible={this.state.optionModalVisible}
                  onPlayPress={() => {
                    this.handleAudioPress(this.currentItem);
                  }}
                  onPlaylistPress={() => {
                    this.context.addToPlaylist(this.currentItem);
                    this.setState({ ...this.state, optionModalVisible: false });
                  }}
                />
              </Screen>
            </View>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  TitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default AudioList;
