import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, FlatList, TouchableOpacity, View } from "react-native";
import colors from "../misc/color";
import PlaylistAddModal from "../components/PlaylistAddModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioContext } from "../context/AudioProvider";

const Playlist = ({}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  const createPlaylist = async (playlistName) => {
    AsyncStorage.getItem("playlist")
      .then(async (response) => {
        if (response) {
          const audios = [];
          if (addToPlayList) {
            audios.push(addToPlayList);
          }
          const newPlaylist = { id: Date.now(), title: playlistName, audios: audios };
          const updatedPlaylist = [...playList, newPlaylist];
          updateState(context, { addToPlayList: null, playList: updatedPlaylist });
          await AsyncStorage.setItem("playlist", JSON.stringify(updatedPlaylist));
        }
        setModalVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderPlaylist = async () => {
    AsyncStorage.getItem("playlist")
      .then(async (response) => {
        if (!response) {
          const defaultPlaylist = {
            id: Date.now(),
            title: "My Favorites",
            audios: [],
          };
          const newPlaylist = [...playList, defaultPlaylist];
          updateState(context, { playList: newPlaylist });
          return await AsyncStorage.setItem("playlist", JSON.stringify([...newPlaylist]));
        }
        updateState(context, { playList: JSON.parse(response) });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBannerPress = (playlist) => {
    // update playlist if there is a selected audio, otherwise open playlist

    if (addToPlayList) {
      AsyncStorage.getItem("playlist")
        .then(async (response) => {
          let oldPlaylist = [];
          let updatedPlaylist = [];
          if (response) {
            oldPlaylist = JSON.parse(response);
            updatedPlaylist = oldPlaylist.filter((list) => {
              if (list.id === playlist.id) {
                for (let audio of list.audios) {
                  if (audio.id === addToPlayList.id) {
                    alert("Audio already exists in this playlist");
                    updateState(context, { addToPlayList: null });
                    return;
                  }
                }

                list.audios.push(addToPlayList);
              }

              return list;
            });
          }
          updateState(context, { addToPlayList: null, playList: [...updatedPlaylist] });
          return await AsyncStorage.setItem("playlist", JSON.stringify([...updatedPlaylist]));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Opening playlist");
    }
  };

  useEffect(() => {
    if (!playList.length) {
      renderPlaylist();
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {playList.length
        ? playList.map((item) => (
            <TouchableOpacity
              onPress={() => handleBannerPress(item)}
              key={item.id.toString()}
              style={styles.playlistBanner}
            >
              <Text>{item.title}</Text>
              <Text style={styles.audioCount}>
                {item.audios.length == 1
                  ? `${item.audios.length} song`
                  : `${item.audios.length} songs`}
              </Text>
            </TouchableOpacity>
          ))
        : null}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginTop: 15 }}>
        <Text style={styles.playlistButton}>+ Add New Playlist</Text>
      </TouchableOpacity>
      <PlaylistAddModal
        modalVisible={modalVisible}
        onSubmit={(playlistName) => createPlaylist(playlistName)}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playlistBanner: {
    padding: 5,
    backgroundColor: colors.ACTIVE_FONT,
    borderRadius: 5,
    marginBottom: 10,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.7,
    fontSize: 14,
  },
  playlistButton: {
    color: colors.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
});

export default Playlist;
