import React from "react";
import { StatusBar, StyleSheet, Text, View, Modal, TouchableWithoutFeedback } from "react-native";
import color from "../app/misc/color";

const OptionsModal = ({ visible, title, onClose, onPlayPress, onPlaylistPress }) => {
  return (
    <>
      <StatusBar hidden />
      <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.modal}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.optionsContainer}>
            <Text onPress={onPlayPress} style={styles.option}>
              Play
            </Text>
            <Text onPress={onPlaylistPress} style={styles.option}>
              Add to Playlist
            </Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBG}></View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default OptionsModal;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  optionsContainer: {
    padding: 20,
  },
  option: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.FONT,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 15,
    paddingBottom: 0,
    color: color.FONT_MEDIUM,
  },
  modalBG: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
  },
});
