import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";

const Playlist = ({}) => (
  <ScrollView contentContainerStyle={styles.container}>
    <TouchableOpacity style={styles.playlistBanner}>
      <Text>My Favorites</Text>
      <Text style={styles.audioCount}>0 songs</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{ marginTop: 15 }}>
      <Text style={styles.playlistButton}>+ Add New Playlist</Text>
    </TouchableOpacity>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playlistBanner: {
    padding: 5,
    backgroundColor: color.FONT_MEDIUM,
    borderRadius: 5,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.7,
    fontSize: 14,
  },
  playlistButton: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
});

export default Playlist;
