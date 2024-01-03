import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../misc/color";
import PlaylistAddModal from "../components/PlaylistAddModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Playlist = ({}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const createPlaylist = (playlistName) => {
    AsyncStorage.getItem("playlist")
      .then((response) => {
        const existingPlaylist = response ? JSON.parse(response) : [];
        const newPlaylist = { id: Date.now(), name: playlistName, audios: [] };
        const updatedPlaylist = [...existingPlaylist, newPlaylist];
        AsyncStorage.setItem("playlist", JSON.stringify(updatedPlaylist));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.playlistBanner}>
        <Text>My Favorites</Text>
        <Text style={styles.audioCount}>0 songs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginTop: 15 }}>
        <Text style={styles.playlistButton}>+ Add New Playlist</Text>
      </TouchableOpacity>
      <PlaylistAddModal
        modalVisible={modalVisible}
        onSubmit={(playlistName) => console.log(playlistName)}
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
