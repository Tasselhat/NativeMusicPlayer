import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../misc/color";
import PlaylistAddModal from "../components/PlaylistAddModal";

const Playlist = ({}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.playlistBanner}>
        <Text>My Favorites</Text>
        <Text style={styles.audioCount}>0 songs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginTop: 15 }}>
        <Text style={styles.playlistButton}>+ Add New Playlist</Text>
      </TouchableOpacity>
      <PlaylistAddModal modalVisible={modalVisible} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playlistBanner: {
    padding: 5,
    backgroundColor: colors.FONT_MEDIUM,
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
