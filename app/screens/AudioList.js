import React from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { LayoutProvider, RecyclerListView } from "recyclerlistview";
import AudioListItem from "../../components/AudioListItem";
import Screen from "../../components/Screen";
import OptionsModal from "../../components/OptionsModal";
import { Audio } from "expo-av";
import { play, pause, resume, selectNew } from "../controller/audioController";

export class AudioList extends React.Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
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
    const { playbackObj, soundObj, currentAudio, updateState } = this.context;

    //first play
    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.uri);
      return updateState(this.context, {
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status,
      });
    }

    //pause
    if (soundObj?.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await pause(playbackObj);
      return updateState(this.context, { soundObj: status });
    }

    //resume
    if (soundObj?.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await resume(playbackObj);
      return updateState(this.context, { soundObj: status });
    }

    //new song
    if (soundObj?.isLoaded && currentAudio.id !== audio.id) {
      const status = await selectNew(playbackObj, audio.uri);
      return updateState(this.context, {
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status,
      });
    }

    if (!soundObj?.isLoaded || soundObj.isLoaded === undefined) {
      const status = await play(playbackObj, audio.uri);
      return updateState(this.context, {
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status,
      });
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
