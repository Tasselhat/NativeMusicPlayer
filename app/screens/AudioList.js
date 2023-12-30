import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LayoutProvider, RecyclerListView } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import OptionsModal from "../components/OptionsModal";
import Screen from "../components/Screen";
import { AudioContext } from "../context/AudioProvider";
import { pause, play, resume, selectNew } from "../controller/audioController";
import { storeAudioForNextOpening } from "../misc/helper";

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
    const { playbackObj, soundObj, currentAudio, updateState, audioFiles } = this.context;

    //first play
    if (soundObj === null) {
      const index = audioFiles.indexOf(audio);
      const status = await play(playbackObj, audio.uri);
      updateState(this.context, {
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      playbackObj.setOnPlaybackStatusUpdate(this.context.onPlaybackStatusUpdate);
      return storeAudioForNextOpening(audio, index);
    }

    //pause
    if (soundObj?.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await pause(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: false });
    }

    //resume
    if (soundObj?.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await resume(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: true });
    }

    //new song
    if (soundObj?.isLoaded && currentAudio.id !== audio.id) {
      const status = await selectNew(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      updateState(this.context, {
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index);
    }

    if (!soundObj?.isLoaded || soundObj.isLoaded === undefined) {
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      updateState(this.context, {
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index);
    }
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
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
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) {
            return (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.TitleText}>No Audio Files Found</Text>
              </View>
            );
          }
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
                  extendedState={{ isPlaying }}
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
