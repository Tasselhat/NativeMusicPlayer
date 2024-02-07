import { Dimensions, FlatList, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../misc/color";
import AudioListItem from "./AudioListItem";
import { selectAudio } from "../controller/audioController";

const PlaylistDetails = ({ modalVisible, playlist, onClose }) => {
  const playAudio = (audio) => {
    selectAudio(audio, context);
  };

  return (
    <Modal visible={modalVisible} animationType="fade" onRequestClose={onClose} transparent>
      <View style={styles.container}>
        <Text style={styles.title} onPress={onClose}>
          {playlist.title}
        </Text>
        <FlatList
          contentContainerStyle={{ padding: 20 }}
          data={playlist.audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <AudioListItem
                title={item.filename}
                duration={item.duration}
                onPlayPress={() => playAudio(item)}
              />
            </View>
          )}
        ></FlatList>
      </View>
      <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
    </Modal>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    height: height * 0.7,
    width: width - 15,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalBG: {
    backgroundColor: colors.MODAL_BG,
    zIndex: -1,
  },
  title: {
    color: colors.ACTIVE_BG,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 5,
  },
});

export default PlaylistDetails;
